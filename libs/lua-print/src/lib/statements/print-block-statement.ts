import { LuaBlockStatement } from '@js-to-lua/lua-types';
import { fmtJoin } from '@js-to-lua/shared-utils';
import { PrintComments, PrintNode } from '../print-node';
import { getPrintableInnerComments } from '../printable-comments';
import { PrinterFunction } from '../printer-function';

export const createPrintBlockStatement = (
  printNode: PrintNode,
  printComments: PrintComments
): PrinterFunction<LuaBlockStatement> => {
  return (node: LuaBlockStatement) => {
    const blockBody = fmtJoin(
      '\n  ',
      node.body.map((value) => printNode(value))
    );
    const innerComments = printComments(
      getPrintableInnerComments(node.innerComments)
    );

    if (blockBody.toString().length > 0) {
      return `do${innerComments.toString() ? ` ${innerComments}` : ''}
  ${blockBody}
end`;
    }

    return `do${innerComments.toString() ? ` ${innerComments}` : ''}
end`;
  };
};
