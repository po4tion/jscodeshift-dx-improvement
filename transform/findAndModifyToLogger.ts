import { API, ASTPath, FileInfo, ObjectExpression } from "jscodeshift";

const IDENTIFIER = {
  filepath: "filepath",
} as const;

/**
 * Returns Changed AST
 * @param file - The first input FileInfo
 * @param param1 - The second input API
 * @returns Changed AST string
 */
export default function transformer(file: FileInfo, { jscodeshift: j }: API) {
  const source = j(file.source);

  source
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "console",
        },
        property: {
          type: "Identifier",
          name: "debug",
        },
      },
    })
    .forEach((path) => {
      const loggerArguments: ASTPath<ObjectExpression[]> = path.get("arguments");

      const hasObjectExpression =
        loggerArguments.value.length > 0 &&
        j.ObjectExpression.check(loggerArguments.value[0]);

      // console.debug의 argument에 객체 표현식이 있는지 검증
      if (hasObjectExpression) {
        const { properties } = loggerArguments.value[0];
        const hasFilepath = properties.some((property) => {
          // property's type guard
          if (j.Property.check(property)) {
            const { key } = property;

            return j.Identifier.check(key) && key.name === IDENTIFIER.filepath;
          }

          return false;
        });

        // filepath 값이 선언되어 있지 않은 경우에만 AST 수정
        if (!hasFilepath) {
          properties.push(
            j.property(
              "init",
              j.identifier(IDENTIFIER.filepath),
              j.stringLiteral(file.path)
            )
          );
        }
      }
    });

  return source.toSource();
}
