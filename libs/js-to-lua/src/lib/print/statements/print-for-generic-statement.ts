import { ForGenericStatement, LuaComment, LuaNode } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { prependString } from '../../utils/prepend-string';

export const createPrintForGenericStatement =
  (
    printNode: (node: LuaNode) => string,
    printComments: (comments: ReadonlyArray<LuaComment> | undefined) => string
  ) =>
  (node: ForGenericStatement): string => {
    const variables = node.variables.map(printNode).join(', ');
    const iterators = node.iterators.map(printNode).join(', ');
    const body = node.body.map(printNode).map(prependString('\t')).join('\n');
    const innerComments = printComments(node.innerComments);

    const forBody = [
      `do${innerComments}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'end',
    ]
      .filter(isTruthy)
      .join('\n');

    return `for ${variables} in ${iterators} ${forBody}`;
  };
