import {
  LuaFunctionDeclaration,
  LuaTypeAliasDeclaration,
  LuaVariableDeclaration,
  UnhandledStatement,
} from '../lua-nodes.types';

export type LuaDeclaration =
  | LuaFunctionDeclaration
  | LuaVariableDeclaration
  | LuaTypeAliasDeclaration
  | UnhandledStatement;
