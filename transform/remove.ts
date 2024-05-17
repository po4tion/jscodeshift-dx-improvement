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
    .find(j.VariableDeclarator)
    .filter(
      (path) => path.node.id.type === "Identifier" && path.node.id.name === "myName2"
    )
    .remove();

  return source.toSource();
}
