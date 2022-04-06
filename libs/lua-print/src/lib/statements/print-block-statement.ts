import { LuaBlockStatement, LuaComment } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { getPrintableInnerComments } from '../printable-comments';
import { PrinterFunction } from '../printer-function';

export const createPrintBlockStatement = (
  printNode: PrintNode,
  printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
): PrinterFunction<LuaBlockStatement> => {
  return (node: LuaBlockStatement) => {
    const blockBody = node.body.map((value) => printNode(value)).join('\n  ');
    const innerComments = printComments(
      getPrintableInnerComments(node.innerComments)
    );

    if (blockBody.length > 0) {
      return `do${innerComments ? ` ${innerComments}` : ''}
  ${blockBody}
end`;
    }

    return `do${innerComments ? ` ${innerComments}` : ''}
end`;
  };
};
