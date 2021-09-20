import { BaseLuaNode } from './node.types';
import { AssignmentStatement, LuaStatement } from './statement';
import { LuaExpression, LuaLVal } from './expression';
import { LuaPropertySignature, LuaType } from './type';

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
  expression: LuaExpression | AssignmentStatement;
}

export interface LuaCallExpression extends BaseLuaNode {
  type: 'CallExpression';
  callee: LuaExpression;
  arguments: LuaExpression[];
}

export interface LuaTableNoKeyField extends BaseLuaNode {
  type: 'TableNoKeyField';
  value: LuaExpression;
}

export interface LuaTableExpressionKeyField extends BaseLuaNode {
  type: 'TableExpressionKeyField';
  key: LuaExpression;
  value: LuaExpression;
}

export interface LuaTableNameKeyField extends BaseLuaNode {
  type: 'TableNameKeyField';
  key: LuaIdentifier;
  value: LuaExpression;
}

export type LuaTableKeyField =
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export type LuaTableField =
  | LuaTableNoKeyField
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export interface LuaTableConstructor extends BaseLuaNode {
  type: 'TableConstructor';
  elements: LuaTableField[];
}

export interface UnhandledStatement extends BaseLuaNode {
  type: 'UnhandledStatement';
}

export interface UnhandledExpression extends BaseLuaNode {
  type: 'UnhandledExpression';
}

export interface UnhandledTypeAnnotation extends BaseLuaNode {
  type: 'UnhandledTypeAnnotation';
}

export interface UnhandledElement extends BaseLuaNode {
  type: 'UnhandledElement';
}

export interface LuaProgram extends BaseLuaNode {
  type: 'Program';
  body: LuaStatement[];
}

export interface LuaIdentifier extends BaseLuaNode {
  type: 'Identifier';
  name: string;
  typeAnnotation?: LuaTypeAnnotation;
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
  body: Array<LuaStatement>;
  returnType?: LuaTypeAnnotation;
  isLocal: boolean;
}

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  body: Array<LuaStatement>;
  returnType?: LuaTypeAnnotation;
}

export type TypeAnnotation = LuaTypeAnnotation | UnhandledTypeAnnotation;

export interface LuaTypeAnnotation extends BaseLuaNode {
  type: 'LuaTypeAnnotation';
  typeAnnotation?: LuaType;
}

export interface LuaTypeAliasDeclaration extends BaseLuaNode {
  type: 'LuaTypeAliasDeclaration';
  id: LuaIdentifier;
  typeAnnotation: LuaType | LuaMemberExpression;
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
export interface LuaUnaryDeleteExpression extends BaseLuaNode {
  type: 'LuaUnaryDeleteExpression';
  argument: LuaExpression;
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
  body: LuaNode[];
}

export interface LuaElseifClause extends BaseLuaNode {
  type: 'ElseifClause';
  condition: LuaExpression;
  body: LuaNode[];
}

export interface LuaElseClause extends BaseLuaNode {
  type: 'ElseClause';
  body: LuaNode[];
}

export type LuaClause = LuaIfClause | LuaElseifClause | LuaElseClause;
