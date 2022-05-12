import { LuaNodeGroup } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import {
  _printComments,
  getPrintableInnerComments,
} from '../printable-comments';
import { PrinterFunction } from '../printer-function';

export const createPrintNodeGroup = (
  printNode: PrintNode
): PrinterFunction<LuaNodeGroup> => {
  return (node) => {
    const printedBody = node.body
      .map((node) => printNode(node))
      .filter(Boolean)
      .join('\n');

    const innerComments = _printComments(
      getPrintableInnerComments(node.innerComments)
    );

    return `${innerComments}${printedBody}`;
  };
};
