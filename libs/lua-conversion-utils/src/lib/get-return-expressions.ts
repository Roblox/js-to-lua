import {
  isExpression,
  LuaExpression,
  LuaNode,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { last } from 'ramda';

export function getReturnExpressions<N extends LuaNode>(
  node: N
): N['type'] extends LuaExpression['type'] ? [N] : LuaExpression[];
export function getReturnExpressions(node: LuaNode): LuaExpression[] {
  if (isExpression(node)) {
    return [node];
  }

  switch (node.type) {
    case 'NodeGroup': {
      const lastItem_ = last(node.body);
      if (lastItem_) {
        return getReturnExpressions(lastItem_);
      }
      break;
    }
    case 'AssignmentStatement':
      return node.identifiers;
  }
  return [unhandledExpression()];
}
