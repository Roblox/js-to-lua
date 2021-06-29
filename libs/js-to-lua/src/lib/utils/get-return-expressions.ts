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
    case 'NodeGroup':
      return node.body.length && getReturnExpressions(lastItem(node.body));
    case 'AssignmentStatement':
      return node.identifiers;
    default:
      return [unhandledExpression()];
  }
};

const lastItem = <T>(arr: T[]): T =>
  arr.length ? arr[arr.length - 1] : undefined;
