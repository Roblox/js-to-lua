import { isAnyNodeType } from '../node.types';
import { isTypeAliasDeclaration, LuaTypeAliasDeclaration } from './type-alias';
import { isFunctionDeclaration, LuaFunctionDeclaration } from './function';
import { isVariableDeclaration, LuaVariableDeclaration } from './variable';
import { isUnhandledStatement, UnhandledStatement } from '../unhandled';

export type LuaDeclaration =
  | LuaFunctionDeclaration
  | LuaVariableDeclaration
  | LuaTypeAliasDeclaration
  | UnhandledStatement;

export const isLuaDeclaration = isAnyNodeType<LuaDeclaration>([
  isFunctionDeclaration,
  isVariableDeclaration,
  isTypeAliasDeclaration,
  isUnhandledStatement,
]);
