import { Identifier } from '@babel/types';
import { BaseNodeHandler } from '@js-to-lua/handler-utils';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
} from '@js-to-lua/lua-types';

export type IdentifierHandler = BaseNodeHandler<
  IdentifierHandlerTo,
  IdentifierHandlerFrom
>;

export type IdentifierStrictHandler = BaseNodeHandler<
  IdentifierStrictHandlerTo,
  IdentifierHandlerFrom
>;

export type IdentifierHandlerFunction = IdentifierHandler['handler'];
export type IdentifierStrictHandlerFunction =
  IdentifierStrictHandler['handler'];

export type IdentifierHandlerFrom = Identifier;

export type IdentifierHandlerTo =
  | LuaNilLiteral
  | LuaIdentifier
  | LuaMemberExpression
  | LuaBinaryExpression;

export type IdentifierStrictHandlerFrom = Identifier;

export type IdentifierStrictHandlerTo = LuaIdentifier;
