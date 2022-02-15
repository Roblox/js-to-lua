import { MemberExpression, isIdentifier, isStringLiteral } from '@babel/types';

export function matchesBabelMemberExpressionProperty(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    (!node.computed &&
      isIdentifier(node.property) &&
      node.property.name === identifierName) ||
    (node.computed &&
      isStringLiteral(node.property) &&
      node.property.value === identifierName)
  );
}

export function matchesBabelMemberExpressionObject(
  identifierName: string,
  node: MemberExpression
): boolean {
  return isIdentifier(node.object) && node.object.name === identifierName;
}
