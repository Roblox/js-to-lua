import { WhileStatement } from './while-statement';
import { LuaDeclaration } from '../declaration';
import { LuaBlockStatement } from './block-statement';
import { LuaReturnStatement } from './return-statement';
import { LuaIfStatement } from './if-statement';
import { LuaNodeGroup } from './node-group';
import { AssignmentStatement } from './assignment-statement';
import { ExportTypeStatement } from './export-type-statement';
import { ForGenericStatement } from './for-generic-statement';
import { BreakStatement } from './break-statement';
import { RepeatStatement } from './repeat-statement';
import { UnhandledStatement } from '../unhandled';
import { LuaExpressionStatement } from './expression-statement';

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
  | RepeatStatement
  | WhileStatement
  | UnhandledStatement;
