import {
  Identifier,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  isStringLiteral as isBabelStringLiteral,
  MemberExpression,
} from '@babel/types';

const dateMethods = ['now'] as const;

type DateMethod = typeof dateMethods[number];

export const isDateIdentifier = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  node: object
): node is Identifier & { name: 'Date' } =>
  isBabelIdentifier(node) && node.name === 'Date';

export const isDateMethod =
  (methodName: DateMethod) =>
  (
    // eslint-disable-next-line @typescript-eslint/ban-types
    node: object
  ): node is MemberExpression =>
    isBabelMemberExpression(node) &&
    isDateIdentifier(node.object) &&
    ((!node.computed &&
      isBabelIdentifier(node.property) &&
      node.property.name === methodName) ||
      (node.computed &&
        isBabelStringLiteral(node.property) &&
        node.property.value === methodName));
