import { LuaIndexSignature } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintIndexSignature =
  (printNode: PrintNode) =>
  (node: LuaIndexSignature): string =>
    `[${printNode(node.parameter)}]${printNode(node.typeAnnotation)}`;
