import { WhileStatement } from '@js-to-lua/lua-types';
import { LuaComment, LuaNode } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { prependString } from '../../utils/prepend-string';

export const createPrintWhileStatement =
  (
    printNode: (node: LuaNode) => string,
    printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
  ) =>
  (node: WhileStatement): string => {
    const condition = printNode(node.condition);
    const body = node.body.map(printNode).map(prependString('\t')).join('\n  ');
    const innerComments = printComments(node.innerComments);

    const whileBody = [
      `do${innerComments}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'end',
    ]
      .filter(isTruthy)
      .join('\n');

    return `while ${condition} ${whileBody}`;
  };
