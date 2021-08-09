import {
  AssignmentStatement,
  BreakStatement,
  ExportTypeStatement,
  ForGenericStatement,
  LuaBlockStatement,
  LuaNodeGroup,
  RepeatStatement,
} from '../statement';
import {
  LuaExpressionStatement,
  LuaIfStatement,
  LuaReturnStatement,
  LuaVariableDeclaration,
  UnhandledStatement,
} from '../lua-nodes.types';
import { LuaDeclaration } from '../declaration';

export type LuaStatement =
  | LuaExpressionStatement
  | LuaBlockStatement
  | LuaReturnStatement
  | LuaVariableDeclaration
  | LuaIfStatement
  | LuaNodeGroup
  | LuaDeclaration
  | AssignmentStatement
  | ExportTypeStatement
  | ForGenericStatement
  | BreakStatement
  | RepeatStatement
  | UnhandledStatement;
