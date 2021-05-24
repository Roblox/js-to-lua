export type LuaNode =
  | LuaProgram
  | LuaExpressionStatement
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral
  | LuaTableConstructor
  | LuaTableField
  | LuaIdentifier
  | LuaNilLiteral
  | LuaCallExpression
  | LuaVariableDeclaration
  | LuaVariableDeclarator
  | LuaVariableDeclaratorIdentifier
  | LuaVariableDeclaratorValue
  | LuaFunctionDeclaration
  | LuaBlockStatement
  | LuaTypeAnnotation
  | LuaType
  | LuaTypeAliasDeclaration
  | LuaBlockStatement
  | LuaPropertySignature
  | LuaBinaryExpression
  | UnhandledNode;

export interface BaseLuaNode {
  type: string;
}

export type LuaLiteral =
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral
  | LuaNilLiteral;

export type LuaExpression =
  | LuaLiteral
  | LuaTableConstructor
  | LuaIdentifier
  | LuaCallExpression
  | LuaBinaryExpression
  | UnhandledNode;

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

export interface LuaNumericLiteral extends BaseLuaNode {
  type: 'NumericLiteral';
  value: number;
  extra?: {
    raw?: string;
  };
}

export interface LuaStringLiteral extends BaseLuaNode {
  type: 'StringLiteral';
  value: string;
}

export interface LuaBooleanLiteral extends BaseLuaNode {
  type: 'BooleanLiteral';
  value: boolean;
}

export interface LuaNilLiteral extends BaseLuaNode {
  type: 'NilLiteral';
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

export interface UnhandledNode extends BaseLuaNode {
  type: 'UnhandledNode';
  start: number | null;
  end: number | null;
}

export interface LuaProgram extends BaseLuaNode {
  type: 'Program';
  body: LuaNode[];
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
  body: LuaNode[];
}

export interface LuaVariableDeclarator {
  type: 'VariableDeclarator';
  id: LuaLVal;
  init: LuaExpression | null;
}

export type LuaLVal = LuaIdentifier /*| MemberExpression | RestElement | AssignmentPattern | ArrayPattern | ObjectPattern | TSParameterProperty*/;

export interface LuaVariableDeclaratorIdentifier {
  type: 'VariableDeclaratorIdentifier';
  value: LuaLVal;
}

export interface LuaVariableDeclaratorValue {
  type: 'VariableDeclaratorValue';
  value: LuaExpression | null;
}

export interface LuaFunctionDeclaration {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionDeclarationParam>;
  defaultValues: Array<any>; //TODO: should be <LuaAssignmentPattern>, but it's not available yet
  body: Array<LuaNode>;
}

export type LuaFunctionDeclarationParam = LuaIdentifier; /*| Pattern | RestElement | TSParameterProperty*/

export interface LuaTypeAny {
  type: 'LuaTypeAny';
}

export interface LuaTypeString {
  type: 'LuaTypeString';
}

export interface LuaTypeNumber {
  type: 'LuaTypeNumber';
}

export interface LuaTypeBoolean {
  type: 'LuaTypeBoolean';
}

export interface LuaTypeLiteral {
  type: 'LuaTypeLiteral';
  members: Array<LuaTypeElement>;
}

export type LuaType = LuaTypeAny | LuaTypeString | LuaTypeNumber | LuaTypeBoolean | LuaTypeLiteral;

export interface LuaTypeAnnotation {
  type: 'LuaTypeAnnotation';
  typeAnnotation: LuaType | null;
}

export interface LuaTypeAliasDeclaration {
  type: 'LuaTypeAliasDeclaration';
  id: LuaIdentifier;
  typeAnnotation: LuaType;
}
export interface LuaPropertySignature {
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
  | '..';
export interface LuaBinaryExpression {
  type: 'LuaBinaryExpression';
  operator: LuaBinaryExpressionOperator;
  left: LuaExpression;
  right: LuaExpression;
}
