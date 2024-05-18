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

  source.find(j.CatchClause).forEach((path) => {
    const param = path.node.param;

    if (param) {
      // param이 Identifier 타입인지 확인
      if (param.type === "Identifier") {
        const { name: paramName } = param;

        j(path)
          .find(j.CallExpression, {
            callee: {
              object: { name: "console" },
              property: { name: "error" },
            },
          })
          .forEach((consolePath) => {
            const args = consolePath.node.arguments;
            if (args.length === 1 && args[0].type === "ObjectExpression") {
              const properties = args[0].properties;
              const hasErrorProperty = properties.some((property) => {
                // console.log(`🟢 ${inspect(property)}`);
                if (j.ObjectProperty.check(property)) {
                  const { key } = property;

                  return j.Identifier.check(key) && key.name === IDENTIFIER.error;
                }

                return false;
              });

              console.log(`🟢 ${hasErrorProperty}`);

              if (!hasErrorProperty) {
                if (paramName === IDENTIFIER.error) {
                  // 매개변수 이름이 'error'일 때 객체 리터럴 축약 문법을 사용한다
                  properties.push(
                    j.property.from({
                      kind: "init",
                      key: j.identifier("error"),
                      shorthand: true,
                      value: j.identifier("error"),
                    })
                  );
                } else {
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

  return source.toSource();
}
