import { appendComments } from '@js-to-lua/handler-utils';
import { LuaNode } from '@js-to-lua/lua-types';

export const reassignComments = <N extends LuaNode, R extends LuaNode>(
  node: N,
  ...otherNodes: R[]
): N => {
  return otherNodes.reduce((acc, otherNode) => {
    return {
      ...acc,
      leadingComments: appendComments(
        acc.leadingComments,
        otherNode.leadingComments
      ),
      trailingComments: appendComments(
        acc.trailingComments,
        otherNode.trailingComments
      ),
      innerComments: appendComments(acc.innerComments, otherNode.innerComments),
    };
  }, node);
};
