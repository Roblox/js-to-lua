import { LuaBlockStatement } from '@js-to-lua/lua-types';
import { PrintComments, PrintNode } from '../print-node';
import { getPrintableInnerComments } from '../printable-comments';
import { PrinterFunction } from '../printer-function';

export const createPrintBlockStatement = (
  printNode: PrintNode,
  printComments: PrintComments
): PrinterFunction<LuaBlockStatement> => {
  return (node: LuaBlockStatement) => {
    const blockBody = node.body.map((value) => printNode(value)).join('\n  ');
    const innerComments = printComments(
      getPrintableInnerComments(node.innerComments)
    );

    if (blockBody.length > 0) {
      return `do${innerComments.toString() ? ` ${innerComments}` : ''}
  ${blockBody}
end`;
    }

    return `do${innerComments.toString() ? ` ${innerComments}` : ''}
end`;
  };
};
