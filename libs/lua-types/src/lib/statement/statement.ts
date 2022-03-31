import { isWhileStatement, WhileStatement } from './while-statement';
import { LuaDeclaration, isLuaDeclaration } from '../declaration';
import { isBlockStatement, LuaBlockStatement } from './block-statement';
import { isReturnStatement, LuaReturnStatement } from './return-statement';
import { isIfStatement, LuaIfStatement } from './if-statement';
import { isNodeGroup, LuaNodeGroup } from './node-group';
import {
  AssignmentStatement,
  isAssignmentStatement,
} from './assignment-statement';
import {
  ExportTypeStatement,
  isExportTypeStatement,
} from './export-type-statement';
import {
  ForGenericStatement,
  isForGenericStatement,
} from './for-generic-statement';
import { BreakStatement, isBreakStatement } from './break-statement';
import { isRepeatStatement, RepeatStatement } from './repeat-statement';
import { isUnhandledStatement, UnhandledStatement } from '../unhandled';
import {
  LuaExpressionStatement,
  isExpressionStatement,
} from './expression-statement';
import { isAnyNodeType } from '../node.types';
import { ContinueStatement, isContinueStatement } from './continue-statement';

export type LuaStatement =
  | LuaExpressionStatement
  | LuaBlockStatement
  | LuaReturnStatement
  | LuaIfStatement
  | LuaNodeGroup
  | LuaDeclaration
  | AssignmentStatement
  | ExportTypeStatement
  | ForGenericStatement
  | BreakStatement
  | ContinueStatement
  | RepeatStatement
  | WhileStatement
  | UnhandledStatement;

export const isStatement = isAnyNodeType<LuaStatement>([
  isExpressionStatement,
  isBlockStatement,
  isReturnStatement,
  isIfStatement,
  isNodeGroup,
  isLuaDeclaration,
  isAssignmentStatement,
  isExportTypeStatement,
  isForGenericStatement,
  isBreakStatement,
  isContinueStatement,
  isRepeatStatement,
  isWhileStatement,
  isUnhandledStatement,
]);
