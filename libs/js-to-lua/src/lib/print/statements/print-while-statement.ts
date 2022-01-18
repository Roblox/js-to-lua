import { LuaComment, WhileStatement } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { prependString } from '../../utils/prepend-string';
import { PrintNode } from '../print-node';

export const createPrintWhileStatement =
  (
    printNode: PrintNode,
    printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
  ) =>
  (node: WhileStatement): string => {
    const condition = printNode(node.condition);
    const body = node.body
      .map((n) => printNode(n))
      .map(prependString('\t'))
      .join('\n  ');
    const innerComments = printComments(node.innerComments);

    const whileBody = [
      `do${innerComments ? ` ${innerComments}` : ''}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'end',
    ]
      .filter(isTruthy)
      .join('\n');

    return `while ${condition} ${whileBody}`;
  };
