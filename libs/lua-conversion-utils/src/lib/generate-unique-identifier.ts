import {
  Expression as BabelExpression,
  Identifier as BabelIdentifier,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';

export function generateUniqueIdentifier(
  nodes: Array<string | BabelExpression>,
  defaultValue: string,
  prepend = false
): string {
  return nodes
    .filter(isStringOrBabelIdentifier)
    .map((stringOrIdentifier) =>
      typeof stringOrIdentifier === 'string'
        ? stringOrIdentifier
        : stringOrIdentifier.name
    )
    .some((name) => name === defaultValue)
    ? generateUniqueIdentifier(
        nodes,
        prepend ? `_${defaultValue}` : `${defaultValue}_`,
        prepend
      )
    : defaultValue;
}

const isStringOrBabelIdentifier = (
  nodeOrExpression: string | BabelExpression
): nodeOrExpression is string | BabelIdentifier =>
  typeof nodeOrExpression === 'string' || isBabelIdentifier(nodeOrExpression);
