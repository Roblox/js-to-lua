export type LuaNode =
  | LuaProgram
  | LuaExpressionStatement
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral
  | LuaTableConstructor
  | TableField
  | UnhandledNode;

export interface BaseLuaNode {
  type: string;
}

export type LuaLiteral =
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral;

export type LuaExpression = LuaLiteral | LuaTableConstructor | UnhandledNode;

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaExpression;
}

export interface LuaNumericLiteral extends BaseLuaNode {
  type: 'NumericLiteral';
  value: number;
}

export interface LuaStringLiteral extends BaseLuaNode {
  type: 'StringLiteral';
  value: string;
}

export interface LuaBooleanLiteral extends BaseLuaNode {
  type: 'BooleanLiteral';
  value: boolean;
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
  type: 'TableExpressionKeyField';
  key: LuaStringLiteral | LuaNumericLiteral;
  value: LuaExpression;
}

export type TableField =
  | LuaTableNoKeyField
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export interface LuaTableConstructor extends BaseLuaNode {
  type: 'TableConstructor';
  elements: TableField[];
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
