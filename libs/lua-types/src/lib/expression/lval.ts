import {
  isIndexExpression,
  isMemberExpression,
  isUnhandledExpression,
} from '../lua-nodes.checks';
import {
  LuaIndexExpression,
  LuaMemberExpression,
  UnhandledExpression,
} from '../lua-nodes.types';
import { isAnyNodeType } from '../node.types';
import { LuaIdentifier, isIdentifier } from '../expression';

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
