import { isAnyNodeType } from '../node.types';
import { isUnhandledStatement, UnhandledStatement } from '../unhandled';
import { isFunctionDeclaration, LuaFunctionDeclaration } from './function';
import { isTypeAliasDeclaration, LuaTypeAliasDeclaration } from './type-alias';
import { isVariableDeclaration, LuaVariableDeclaration } from './variable';

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
