import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
  LuaReturnStatement,
  LuaTableConstructor,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  UnhandledExpression,
} from './lua-nodes.types';
import { isAnyNodeType, isNodeType } from './node.types';
import {
  isLiteral,
  isMultilineStringLiteral,
  isStringLiteral,
} from './literals';

export const isTableConstructor = isNodeType<LuaTableConstructor>(
  'TableConstructor'
);
export const isIdentifier = isNodeType<LuaIdentifier>('Identifier');
export const isCallExpression = isNodeType<LuaCallExpression>('CallExpression');
export const isBinaryExpression = isNodeType<LuaBinaryExpression>(
  'LuaBinaryExpression'
);
export const isLogicalExpression = isNodeType<LuaLogicalExpression>(
  'LogicalExpression'
);
export const isFunctionExpression = isNodeType<LuaFunctionExpression>(
  'FunctionExpression'
);
export const isReturnStatement = isNodeType<LuaReturnStatement>(
  'ReturnStatement'
);
export const isUnaryExpression = isNodeType<LuaUnaryExpression>(
  'LuaUnaryExpression'
);
export const isUnaryVoidExpression = isNodeType<LuaUnaryVoidExpression>(
  'LuaUnaryVoidExpression'
);
export const isUnaryNegation = isNodeType<LuaUnaryNegationExpression>(
  'LuaUnaryNegationExpression'
);
export const isIndexExpression = isNodeType<LuaIndexExpression>(
  'IndexExpression'
);
export const isMemberExpression = isNodeType<LuaMemberExpression>(
  'LuaMemberExpression'
);
export const isUnaryDeleteExpression = isNodeType<LuaUnaryDeleteExpression>(
  'LuaUnaryDeleteExpression'
);
export const isUnhandledExpression = isNodeType<UnhandledExpression>(
  'UnhandledExpression'
);

export const isStringInferable = (node: LuaExpression) =>
  isStringLiteral(node) ||
  isMultilineStringLiteral(node) ||
  (isBinaryExpression(node) && node.operator === '..');

export const isExpression = isAnyNodeType<LuaExpression>([
  isLiteral,
  isTableConstructor,
  isIdentifier,
  isCallExpression,
  isBinaryExpression,
  isLogicalExpression,
  isFunctionExpression,
  isReturnStatement,
  isUnaryExpression,
  isUnaryVoidExpression,
  isUnaryNegation,
  isIndexExpression,
  isMemberExpression,
  isUnaryDeleteExpression,
  isUnhandledExpression,
]);
