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
  | UnhandledNode;

export type LuaDeclaration = LuaVariableDeclaration;

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
}

export interface LuaVariableDeclaration extends BaseLuaNode {
  type: 'VariableDeclaration';
  identifiers: LuaVariableDeclaratorIdentifier[];
  values: LuaVariableDeclaratorValue[];
}

export interface LuaVariableDeclarator {
  type: 'VariableDeclarator';
  id: LuaLVal;
  init: LuaExpression | null;
}

export type LuaLVal = LuaIdentifier;

export interface LuaVariableDeclaratorIdentifier {
  type: 'VariableDeclaratorIdentifier';
  value: LuaLVal;
}

export interface LuaVariableDeclaratorValue {
  type: 'VariableDeclaratorValue';
  value: LuaExpression | null;
}
