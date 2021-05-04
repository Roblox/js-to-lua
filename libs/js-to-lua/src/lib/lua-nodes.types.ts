export type LuaNode =
  | LuaProgram
  | LuaExpressionStatement
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral
  | LuaTableConstructor
  | TableField
  | UnhandledNode
  | LuaNilLiteral;

export interface BaseLuaNode {
  type: string;
}

export type LuaLiteral =
  | LuaNumericLiteral
  | LuaStringLiteral
  | LuaBooleanLiteral
  | LuaNilLiteral;

export type LuaExpression = LuaLiteral | LuaTableConstructor | UnhandledNode;

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaExpression;
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
