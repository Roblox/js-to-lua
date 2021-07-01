import {
  isExpression,
  LuaExpression,
  LuaNode,
  unhandledExpression,
} from '@js-to-lua/lua-types';

export const getReturnExpressions = (node: LuaNode): LuaExpression[] => {
  if (isExpression(node)) {
    return [node];
  }

  switch (node.type) {
    case 'NodeGroup': {
      const lastItem_ = lastItem(node.body);
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

const lastItem = <T>(arr: T[]): T | undefined =>
  arr.length ? arr[arr.length - 1] : undefined;
