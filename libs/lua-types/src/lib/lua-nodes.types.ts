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
  LuaFunctionReturnType,
  LuaFunctionTypeParam,
  LuaIndexSignature,
  LuaPropertySignature,
  LuaType,
  LuaTypeElement,
  TypeAnnotation,
} from './type';

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
  | LuaFunctionReturnType
  | LuaFunctionTypeParam
  | LuaTypeElement;
