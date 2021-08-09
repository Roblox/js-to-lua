import { LuaNode, TypeCastExpression } from '@js-to-lua/lua-types';

export const createPrintTypeCastExpression = (
  printNode: (node: LuaNode) => string
) => (node: TypeCastExpression): string =>
  `${printNode(node.expression)} :: ${printNode(node.typeAnnotation)}`;
