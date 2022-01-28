import {
  isLiteral,
  isTableConstructor,
  LuaLiteral,
  LuaTableConstructor,
} from '../literals';
import {
  isTypeCastExpression,
  TypeCastExpression,
} from './type-cast-expression';
import { isAnyNodeType } from '../node.types';
import { isIdentifier, LuaIdentifier } from './identifier';
import { isMemberExpression, LuaMemberExpression } from './member';
import { isIndexExpression, LuaIndexExpression } from './index-expression';
import { isUnaryNegation, LuaUnaryNegationExpression } from './unary-negation';
import { isBinaryExpression, LuaBinaryExpression } from './binary';
import { isLogicalExpression, LuaLogicalExpression } from './logical';
import { isFunctionExpression, LuaFunctionExpression } from './function';
import { isUnaryExpression, LuaUnaryExpression } from './unary';
import { isUnaryVoidExpression, LuaUnaryVoidExpression } from './unary-void';
import { isUnhandledExpression, UnhandledExpression } from '../unhandled';
import { isCallExpression, LuaCallExpression } from './call';

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
