import { LuaComment, RepeatStatement } from '@js-to-lua/lua-types';
import { isTruthy, prependString } from '@js-to-lua/shared-utils';
import { PrintNode } from '../print-node';

export const createPrintRepeatStatement =
  (
    printNode: PrintNode,
    printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
  ) =>
  (node: RepeatStatement): string => {
    const condition = printNode(node.condition);
    const body = node.body
      .map((n) => printNode(n))
      .map(prependString('\t'))
      .join('\n  ');
    const innerComments = printComments(node.innerComments);

    const repeatBody = [
      `repeat${innerComments ? ` ${innerComments}` : ''}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'until',
    ]
      .filter(isTruthy)
      .join('\n');

    return `${repeatBody} ${condition}`;
  };
