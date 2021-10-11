import {
  LuaFunctionDeclaration,
  LuaVariableDeclaration,
  UnhandledStatement,
} from '../lua-nodes.types';
import { LuaTypeAliasDeclaration } from './type-alias';

export type LuaDeclaration =
  | LuaFunctionDeclaration
  | LuaVariableDeclaration
  | LuaTypeAliasDeclaration
  | UnhandledStatement;
