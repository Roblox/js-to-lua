import {
  isSameLineLeadingAndTrailingComment,
  LuaComment,
  LuaProgram,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { last } from 'ramda';
import { PrintNode } from './print-node';
import { getFilteredInnerComments } from './printable-comments';
import { PrinterFunction } from './printer-function';

export const createPrintProgram = (
  printNode: PrintNode,
  printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
): PrinterFunction<LuaProgram> => {
  return function printProgram(node: LuaProgram) {
    const getTrailingSpace = (innerNode: LuaStatement) => {
      if (innerNode === last(node.body)) {
        return '';
      } else if (
        innerNode.trailingComments?.length &&
        isSameLineLeadingAndTrailingComment(last(innerNode.trailingComments)!)
      ) {
        return ' ';
      }
      return '\n';
    };

    const program = node.body
      .map(
        (innerNode) => `${printNode(innerNode)}${getTrailingSpace(innerNode)}`
      )
      .join('');
    const innerComments = printComments(
      getFilteredInnerComments(node.innerComments)
    );
    return `${innerComments}${program}\n`;
  };
};
