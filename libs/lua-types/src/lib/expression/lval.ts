import {
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  UnhandledExpression,
} from '../lua-nodes.types';

export type LuaLVal =
  | LuaIdentifier
  | LuaMemberExpression
  | LuaIndexExpression
  | UnhandledExpression;
