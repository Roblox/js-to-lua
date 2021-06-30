import { BaseLuaNode } from './node.types';
import { AssignmentStatement, LuaNodeGroup } from './statement';
import { LuaLiteral } from './literals';

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
  | LuaClause;

export type LuaStatement =
  | LuaExpressionStatement
  | LuaBlockStatement
  | LuaReturnStatement
  | LuaVariableDeclaration
  | LuaIfStatement
  | LuaNodeGroup
  | LuaDeclaration
  | AssignmentStatement
  | UnhandledStatement;

export type LuaExpression =
  | LuaLiteral
  | LuaTableConstructor
  | LuaIdentifier
  | LuaCallExpression
  | LuaBinaryExpression
  | LuaLogicalExpression
  | LuaFunctionExpression
  | LuaReturnStatement
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaIndexExpression
  | LuaMemberExpression
  | LuaUnaryDeleteExpression
  | UnhandledExpression;

export type LuaDeclaration =
  | LuaFunctionDeclaration
  | LuaVariableDeclaration
  | LuaTypeAliasDeclaration;

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaExpression;
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

export interface LuaBlockStatement extends BaseLuaNode {
  type: 'BlockStatement';
  body: LuaStatement[];
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

export type LuaLVal = LuaIdentifier /*| MemberExpression | RestElement | AssignmentPattern | ArrayPattern | ObjectPattern | TSParameterProperty*/;

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
}

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  body: Array<LuaStatement>;
  returnType?: LuaTypeAnnotation;
}

export interface LuaTypeAny extends BaseLuaNode {
  type: 'LuaTypeAny';
}

export interface LuaTypeString extends BaseLuaNode {
  type: 'LuaTypeString';
}

export interface LuaTypeNumber extends BaseLuaNode {
  type: 'LuaTypeNumber';
}

export interface LuaTypeBoolean extends BaseLuaNode {
  type: 'LuaTypeBoolean';
}

export interface LuaTypeVoid extends BaseLuaNode {
  type: 'LuaTypeVoid';
}

export interface LuaTypeLiteral extends BaseLuaNode {
  type: 'LuaTypeLiteral';
  members: Array<LuaTypeElement>;
}

export type LuaType =
  | LuaTypeAny
  | LuaTypeString
  | LuaTypeNumber
  | LuaTypeBoolean
  | LuaTypeLiteral
  | LuaTypeVoid;

export type TypeAnnotation = LuaTypeAnnotation | UnhandledTypeAnnotation;

export interface LuaTypeAnnotation extends BaseLuaNode {
  type: 'LuaTypeAnnotation';
  typeAnnotation: LuaType | null;
}

export interface LuaTypeAliasDeclaration extends BaseLuaNode {
  type: 'LuaTypeAliasDeclaration';
  id: LuaIdentifier;
  typeAnnotation: LuaType;
}
export interface LuaPropertySignature extends BaseLuaNode {
  type: 'LuaPropertySignature';
  key: LuaExpression;
  typeAnnotation?: LuaTypeAnnotation;
}

type LuaTypeElement = LuaPropertySignature; /*| TSCallSignatureDeclaration | TSConstructSignatureDeclaration |  TSMethodSignature | TSIndexSignature*/

// TODO: may have to add later any of these'&' | '|' | '>>' | '>>>' | '<<' | '^' | '==' | '===' | '!=' | '!==' | 'in' | 'instanceof' | '>' | '<' | '>=' | '<=';
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
  operator: 'throw' | 'delete' | '!' | '-' | '~';
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
