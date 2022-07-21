import { LuaFunctionReturnType } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintFunctionReturnType =
  (printNode: PrintNode) =>
  (node: LuaFunctionReturnType): string => {
    const returnTypeString = node.returnTypes
      .map((n) => printNode(n))
      .join(', ');

    return node.returnTypes.length === 1
      ? returnTypeString
      : `(${returnTypeString})`;
  };
