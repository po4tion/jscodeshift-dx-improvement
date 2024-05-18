import { API, FileInfo } from "jscodeshift";

const IDENTIFIER = {
  error: "error",
} as const;

/**
 * Returns Changed AST
 * @param file - The first input FileInfo
 * @param param1 - The second input API
 * @returns Changed AST string
 */
export default function transformer(file: FileInfo, { jscodeshift: j }: API) {
  const source = j(file.source);

  // 1. catch문을 사용하는지 확인한다
  source.find(j.CatchClause).forEach((path) => {
    const param = path.node.param;

    // 2. catch문이 파라미터를 사용하는지 확인한다
    if (param) {
      // param이 Identifier 타입인지 확인
      if (param.type === "Identifier") {
        const { name: paramName } = param;

        // 3. catch문이 파라미터를 사용하면 catch문 내에서 console.error를 사용하는지 확인한다
        j(path)
          .find(j.CallExpression, {
            callee: {
              object: { name: "console" },
              property: { name: "error" },
            },
          })
          .forEach((consolePath) => {
            const args = consolePath.node.arguments;

            // 4. console.error의 첫번째 인자가 객체 표현식인지 확인한다
            if (args.length === 1 && args[0].type === "ObjectExpression") {
              const properties = args[0].properties;
              const hasErrorProperty = properties.some((property) => {
                if (j.ObjectProperty.check(property)) {
                  const { key } = property;

                  return j.Identifier.check(key) && key.name === IDENTIFIER.error;
                }

                return false;
              });

              // 5. console.error의 첫번째 인자에 error가 이미 입력되어 있는지 확인한다.
              if (!hasErrorProperty) {
                if (paramName === IDENTIFIER.error) {
                  // 7. 매개변수 이름이 'error'일 때 객체 속성 축약 문법을 사용한다
                  properties.push(
                    j.property.from({
                      kind: "init",
                      key: j.identifier("error"),
                      shorthand: true,
                      value: j.identifier("error"),
                    })
                  );
                } else {
                  // 6. 입력되어 있지 않다면 error를 키값으로 하고 catch의 에러 파라미터 이름을 값으로 추가한다
                  properties.push(
                    j.property(
                      "init",
                      j.identifier(IDENTIFIER.error),
                      j.identifier(paramName)
                    )
                  );
                }
              }
            }
          });
      }
    }
  });

  // 8. 소스코드를 수정한다
  return source.toSource();
}
