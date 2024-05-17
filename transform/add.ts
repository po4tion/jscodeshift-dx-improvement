import { API, FileInfo } from "jscodeshift";

/**
 * Returns Changed AST
 * @param file - The first input FileInfo
 * @param param1 - The second input API
 * @returns Changed AST string
 */
export default function transformer(file: FileInfo, { jscodeshift: j }: API) {
  const source = j(file.source);

  source.find(j.ObjectExpression).forEach((path) => {
    path.node.properties.push(
      j.property("init", j.identifier("job"), j.stringLiteral("developer"))
    );
  });

  return source.toSource();
}
