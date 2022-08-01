import { LuaTableConstructor } from '@js-to-lua/lua-types';
import { fmt, fmtJoin } from '@js-to-lua/shared-utils';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintTableConstructor = (
  printNode: PrintNode
): PrinterFunction<LuaTableConstructor> => {
  return (node) => {
    const printedElements = node.elements.map((e) => printNode(e));
    const isMultiline = printedElements.some((v) =>
      v.toString().includes('\n')
    );
    const elements = fmtJoin(isMultiline ? ',\n' : ', ', printedElements);
    const multilineSeparator = isMultiline ? '\n' : '';
    return fmt`{${multilineSeparator}${elements}}${multilineSeparator}`;
  };
};
