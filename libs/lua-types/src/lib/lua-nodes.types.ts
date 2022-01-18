import { LuaExpression, LuaIdentifier, LuaLVal } from './expression';
import { LuaTableField } from './literals';
import { BaseLuaNode } from './node.types';
import { LuaNodeGroup, LuaStatement } from './statement';
import {
  LuaPropertySignature,
  LuaType,
  LuaTypeAnnotation,
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
  | LuaClause
  | UnhandledElement;

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaCallExpression | LuaNodeGroup;
}

export interface LuaCallExpression extends BaseLuaNode {
  type: 'CallExpression';
  callee: LuaExpression;
  arguments: LuaExpression[];
}

export interface UnhandledStatement extends BaseLuaNode {
  type: 'UnhandledStatement';
}

export interface UnhandledExpression extends BaseLuaNode {
  type: 'UnhandledExpression';
}

export interface UnhandledElement extends BaseLuaNode {
  type: 'UnhandledElement';
}

export interface LuaProgram extends BaseLuaNode {
  type: 'Program';
  body: LuaStatement[];
}

export interface LuaVariableDeclaration extends BaseLuaNode {
  type: 'VariableDeclaration';
  identifiers: LuaVariableDeclaratorIdentifier[];
  values: LuaVariableDeclaratorValue[];
}

export interface LuaReturnStatement extends BaseLuaNode {
  type: 'ReturnStatement';
  arguments: LuaExpression[];
}

export interface LuaVariableDeclarator extends BaseLuaNode {
  type: 'VariableDeclarator';
  id: LuaLVal;
  init: LuaExpression | null;
}

export interface LuaVariableDeclaratorIdentifier extends BaseLuaNode {
  type: 'VariableDeclaratorIdentifier';
  value: LuaLVal;
}

export interface LuaVariableDeclaratorValue extends BaseLuaNode {
  type: 'VariableDeclaratorValue';
  value: LuaExpression | null;
}

// TODO: Pattern | RestElement | TSParameterProperty should be added in the future when handled
export type LuaFunctionParam = LuaIdentifier;
export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement>;
  returnType?: LuaTypeAnnotation;
  isLocal: boolean;
}

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement | LuaExpression>;
  returnType?: LuaTypeAnnotation;
}

export type LuaBinaryExpressionOperator =
  | '+'
  | '-'
  | '/'
  | '%'
  | '^'
  | '*'
  | '>'
  | '<'
  | '>='
  | '<='
  | '..'
  | '=='
  | '~=';

export interface LuaBinaryExpression extends BaseLuaNode {
  type: 'LuaBinaryExpression';
  operator: LuaBinaryExpressionOperator;
  left: LuaExpression;
  right: LuaExpression;
}

export enum LuaLogicalExpressionOperatorEnum {
  AND = 'and',
  OR = 'or',
}

export type LuaLogicalExpressionOperator =
  | LuaLogicalExpressionOperatorEnum.AND
  | LuaLogicalExpressionOperatorEnum.OR;

export interface LuaLogicalExpression extends BaseLuaNode {
  type: 'LogicalExpression';
  operator: LuaLogicalExpressionOperator;
  left: LuaExpression;
  right: LuaExpression;
}
export interface LuaUnaryExpression extends BaseLuaNode {
  type: 'LuaUnaryExpression';
  operator: '-';
  argument: LuaExpression;
}

export interface LuaUnaryVoidExpression extends BaseLuaNode {
  type: 'LuaUnaryVoidExpression';
  argument: LuaExpression;
}

export interface LuaUnaryNegationExpression extends BaseLuaNode {
  type: 'LuaUnaryNegationExpression';
  argument: LuaExpression;
}

export interface LuaIndexExpression extends BaseLuaNode {
  type: 'IndexExpression';
  base: LuaExpression;
  index: LuaExpression;
}

export interface LuaMemberExpression extends BaseLuaNode {
  type: 'LuaMemberExpression';
  indexer: '.' | ':';
  base: LuaExpression;
  identifier: LuaIdentifier;
}

export interface LuaIfStatement extends BaseLuaNode {
  type: 'LuaIfStatement';
  ifClause: LuaIfClause;
  elseifClauses?: LuaElseifClause[];
  elseClause?: LuaElseClause;
}

export interface LuaIfClause extends BaseLuaNode {
  type: 'IfClause';
  condition: LuaExpression;
  body: LuaNodeGroup<LuaNode>;
}

export interface LuaElseifClause extends BaseLuaNode {
  type: 'ElseifClause';
  condition: LuaExpression;
  body: LuaNodeGroup<LuaNode>;
}

export interface LuaElseClause extends BaseLuaNode {
  type: 'ElseClause';
  body: LuaNodeGroup<LuaNode>;
}

export type LuaClause = LuaIfClause | LuaElseifClause | LuaElseClause;
