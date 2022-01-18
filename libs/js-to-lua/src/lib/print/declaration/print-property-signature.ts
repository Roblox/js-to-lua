import { isIdentifier, LuaPropertySignature } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintPropertySignature =
  (printNode: PrintNode) => (node: LuaPropertySignature) => {
    const keyString = isIdentifier(node.key)
      ? printNode(node.key)
      : `[${printNode(node.key)}]`;
    return `${keyString}${
      node.typeAnnotation ? printNode(node.typeAnnotation) : ''
    }`;
  };
