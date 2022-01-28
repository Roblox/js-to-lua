import {
  LuaVariableDeclarator,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from './declaration';
import { LuaExpression } from './expression';
import { LuaTableField } from './literals';
import { LuaProgram } from './program';
import { LuaClause, LuaStatement } from './statement';
import {
  LuaIndexSignature,
  LuaPropertySignature,
  LuaType,
  TypeAnnotation,
} from './type';
import { UnhandledElement } from './unhandled';

export type LuaNode =
  | LuaProgram
  | LuaStatement
  | LuaExpression
  | LuaTableField
  | LuaVariableDeclarator
  | LuaVariableDeclaratorIdentifier
  | LuaVariableDeclaratorValue
  | TypeAnnotation
  | LuaType
  | LuaPropertySignature
  | LuaIndexSignature
  | LuaClause
  | UnhandledElement;
