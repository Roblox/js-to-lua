import {
  LuaVariableDeclarator,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from './declaration';
import { LuaExpression, LuaExpressionClause } from './expression';
import { LuaTableField } from './literals';
import { LuaProgram } from './program';
import { LuaClause, LuaStatement } from './statement';
import {
  LuaFunctionTypeParam,
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
  | LuaExpressionClause
  | LuaFunctionTypeParam
  | UnhandledElement;
