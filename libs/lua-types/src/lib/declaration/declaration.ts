import {
  isFunctionDeclaration,
  isUnhandledStatement,
  isVariableDeclaration,
} from '../lua-nodes.checks';
import {
  LuaFunctionDeclaration,
  LuaVariableDeclaration,
  UnhandledStatement,
} from '../lua-nodes.types';
import { isAnyNodeType } from '../node.types';
import { isTypeAliasDeclaration, LuaTypeAliasDeclaration } from './type-alias';

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
