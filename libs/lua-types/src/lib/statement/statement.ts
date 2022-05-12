import { isLuaDeclaration, LuaDeclaration } from '../declaration';
import { isAnyNodeType } from '../node.types';
import { isUnhandledStatement, UnhandledStatement } from '../unhandled';
import {
  AssignmentStatement,
  isAssignmentStatement,
} from './assignment-statement';
import { isBlockStatement, LuaBlockStatement } from './block-statement';
import { BreakStatement, isBreakStatement } from './break-statement';
import { ContinueStatement, isContinueStatement } from './continue-statement';
import {
  ExportTypeStatement,
  isExportTypeStatement,
} from './export-type-statement';
import {
  isExpressionStatement,
  LuaExpressionStatement,
} from './expression-statement';
import {
  ForGenericStatement,
  isForGenericStatement,
} from './for-generic-statement';
import { isIfStatement, LuaIfStatement } from './if-statement';
import { isNodeGroup, LuaNodeGroup } from './node-group';
import { isRepeatStatement, RepeatStatement } from './repeat-statement';
import { isReturnStatement, LuaReturnStatement } from './return-statement';
import { isWhileStatement, WhileStatement } from './while-statement';

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
