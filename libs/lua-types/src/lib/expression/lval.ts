import { isAnyNodeType } from '../node.types';
import { isIdentifier, LuaIdentifier } from './identifier';
import { isMemberExpression, LuaMemberExpression } from './member';
import { isIndexExpression, LuaIndexExpression } from './index-expression';
import { isUnhandledExpression, UnhandledExpression } from '../unhandled';

export type LuaLVal =
  | LuaIdentifier
  | LuaMemberExpression
  | LuaIndexExpression
  | UnhandledExpression;

export const isLuaLVal = isAnyNodeType<LuaLVal>([
  isIdentifier,
  isMemberExpression,
  isIndexExpression,
  isUnhandledExpression,
]);
