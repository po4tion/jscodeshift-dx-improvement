import { API, FileInfo } from "jscodeshift";

/**
 * Returns Changed AST
 * @param file - The first input FileInfo
 * @param param1 - The second input API
 * @returns Changed AST string
 */
export default function transformer(file: FileInfo, { jscodeshift: j }: API) {
  const source = j(file.source);

  // 첫번째 방법 - 범위를 한정적으로 좁혔으므로 속도가 더 빠르다(상수 또는 변수로 선언된 'po4tion'을 찾는 경우)
  source
    .find(j.VariableDeclarator, {
      init: {
        type: "StringLiteral",
      },
    })
    .forEach((path) => {
      if (path.node.init?.type === "StringLiteral") {
        if (path.node.init.value === "po4tion") {
          console.log(`🚀 ${file.path}`);
        }
      }
    });

  // 두번째 방법 - 범위가 더 포괄적이지만 직관적임(그저 문자열인 'po4tion'을 찾는 경우)
  source.find(j.StringLiteral).forEach((path) => {
    if (path.node.value === "po4tion") {
      console.log(`🚀 ${file.path}`);
    }
  });
}
