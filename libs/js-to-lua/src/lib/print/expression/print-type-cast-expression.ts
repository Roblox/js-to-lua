import { LuaNode, TypeCastExpression } from '@js-to-lua/lua-types';

export const createPrintTypeCastExpression = (
  printNode: (node: LuaNode) => string
) => (node: TypeCastExpression): string => {
  switch (node.expression.type) {
    case 'TypeCastExpression':
      return `(${printNode(node.expression)}) :: ${printNode(
        node.typeAnnotation
      )}`;
    default:
      return `${printNode(node.expression)} :: ${printNode(
        node.typeAnnotation
      )}`;
  }
};
