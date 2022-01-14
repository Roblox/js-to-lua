import {
  isLiteral,
  isTableConstructor,
  LuaLiteral,
  LuaTableConstructor,
} from '../literals';
import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaFunctionExpression,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
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
  isIndexExpression,
  isLogicalExpression,
  isMemberExpression,
  isUnaryExpression,
  isUnaryNegation,
  isUnaryVoidExpression,
  isUnhandledExpression,
} from '../lua-nodes.checks';
import { isIdentifier, LuaIdentifier } from './identifier';

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
  isTypeCastExpression,
  isUnhandledExpression,
]);
