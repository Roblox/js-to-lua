import { LuaTableExpressionKeyField } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintTableExpressionKeyField =
  (printNode: PrintNode): PrinterFunction<LuaTableExpressionKeyField> =>
  (node): string =>
    `[${printNode(node.key)}] = ${printNode(node.value)}`;
