import { LuaComment, LuaNode, RepeatStatement } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { prependString } from '../../utils/prepend-string';

export const createPrintRepeatStatement =
  (
    printNode: (node: LuaNode) => string,
    printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
  ) =>
  (node: RepeatStatement): string => {
    const condition = printNode(node.condition);
    const body = node.body.map(printNode).map(prependString('\t')).join('\n  ');
    const innerComments = printComments(node.innerComments);

    const repeatBody = [
      `repeat${innerComments}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'until',
    ]
      .filter(isTruthy)
      .join('\n');

    return `${repeatBody} ${condition}`;
  };
