import { isLiteral, LuaLiteral } from '../literals';
import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
  LuaTableConstructor,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  UnhandledExpression,
} from '../lua-nodes.types';
import {
  isTypeCastExpression,
  TypeCastExpression,
} from './type-cast-expression';
import { isAnyNodeType } from '../node.types';
import {
  isBinaryExpression,
  isCallExpression,
  isFunctionExpression,
  isIdentifier,
  isIndexExpression,
  isLogicalExpression,
  isMemberExpression,
  isTableConstructor,
  isUnaryDeleteExpression,
  isUnaryExpression,
  isUnaryNegation,
  isUnaryVoidExpression,
  isUnhandledExpression,
} from '../lua-nodes.checks';

export type LuaExpression =
  | LuaLiteral
  | LuaTableConstructor
  | LuaIdentifier
  | LuaCallExpression
  | LuaBinaryExpression
  | LuaLogicalExpression
  | LuaFunctionExpression
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaIndexExpression
  | LuaMemberExpression
  | LuaUnaryDeleteExpression
  | TypeCastExpression
  | UnhandledExpression;

export const isExpression = isAnyNodeType<LuaExpression>([
  isLiteral,
  isTableConstructor,
  isIdentifier,
  isCallExpression,
  isBinaryExpression,
  isLogicalExpression,
  isFunctionExpression,
  isUnaryExpression,
  isUnaryVoidExpression,
  isUnaryNegation,
  isIndexExpression,
  isMemberExpression,
  isUnaryDeleteExpression,
  isTypeCastExpression,
  isUnhandledExpression,
]);
