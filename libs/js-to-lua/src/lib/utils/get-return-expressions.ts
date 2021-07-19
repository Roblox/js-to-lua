import {
  isExpression,
  LuaExpression,
  LuaNode,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { last } from 'ramda';

export const getReturnExpressions = (node: LuaNode): LuaExpression[] => {
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
};
