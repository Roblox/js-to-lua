import {
  isIdentifier,
  LuaNode,
  LuaPropertySignature,
} from '@js-to-lua/lua-types';

export const createPrintPropertySignature =
  (printNode: (node: LuaNode) => string) => (node: LuaPropertySignature) => {
    const keyString = isIdentifier(node.key)
      ? printNode(node.key)
      : `[${printNode(node.key)}]`;
    return `${keyString}${
      node.typeAnnotation ? printNode(node.typeAnnotation) : ''
    }`;
  };
