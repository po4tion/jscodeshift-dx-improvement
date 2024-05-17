import { API, FileInfo } from "jscodeshift";

/**
 * Returns Changed AST
 * @param file - The first input FileInfo
 * @param param1 - The second input API
 * @returns Changed AST string
 */
export default function transformer(file: FileInfo, { jscodeshift: j }: API) {
  const source = j(file.source);

  source
    .find(j.ObjectProperty, {
      value: {
        type: "StringLiteral",
        value: "김동규",
      },
    })
    .forEach((path) => {
      if (path.node.value.type === "StringLiteral") {
        path.node.value.value = "홍길동";
      }
    });

  return source.toSource();
}
