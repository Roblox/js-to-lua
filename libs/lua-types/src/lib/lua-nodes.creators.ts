import {
  LuaBooleanLiteral,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionExpression,
  LuaFunctionParam,
  LuaIdentifier,
  LuaLVal,
  LuaNode,
  LuaNumericLiteral,
  LuaProgram,
  LuaReturnStatement,
  LuaStringLiteral,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaTypeAnnotation,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  UnhandledNode,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
} from './lua-nodes.types';

export const program = (body: LuaNode[] = []): LuaProgram => ({
  type: 'Program',
  body,
});

export const expressionStatement = (
  expression: LuaExpression
): LuaExpressionStatement => ({
  type: 'ExpressionStatement',
  expression,
});

export const returnStatement = (argument: LuaNode): LuaReturnStatement => ({
  type: 'ReturnStatement',
  argument,
});

export const variableDeclaration = (
  identifiers: LuaVariableDeclaratorIdentifier[],
  values: LuaVariableDeclaratorValue[]
): LuaVariableDeclaration => ({
  type: 'VariableDeclaration',
  identifiers,
  values,
});

export const variableDeclaratorIdentifier = (
  value: LuaLVal
): LuaVariableDeclaratorIdentifier => ({
  type: 'VariableDeclaratorIdentifier',
  value,
});

export const variableDeclaratorValue = (
  value: LuaExpression | null
): LuaVariableDeclaratorValue => ({
  type: 'VariableDeclaratorValue',
  value,
});

export const functionExpression = (
  params: Array<LuaFunctionParam>,
  defaultValues: Array<any>,
  body: Array<LuaNode>
): LuaFunctionExpression => ({
  type: 'FunctionExpression',
  params,
  defaultValues, //TODO: should be <LuaAssignmentPattern>, but it's not available yet
  body,
});

export const tableConstructor = (
  elements: LuaTableConstructor['elements'] = []
): LuaTableConstructor => ({
  type: 'TableConstructor',
  elements,
});

export const tableNameKeyField = (
  key: LuaTableNameKeyField['key'],
  value: LuaTableNameKeyField['value']
): LuaTableNameKeyField => ({
  type: 'TableNameKeyField',
  key,
  value,
});

export const tableExpressionKeyField = (
  key: LuaTableExpressionKeyField['key'],
  value: LuaTableExpressionKeyField['value']
): LuaTableExpressionKeyField => ({
  type: 'TableExpressionKeyField',
  key,
  value,
});

export const tableNoKeyField = (
  value: LuaTableNoKeyField['value']
): LuaTableNoKeyField => ({
  type: 'TableNoKeyField',
  value,
});

export const numericLiteral = (
  value: LuaNumericLiteral['value'],
  raw?: LuaNumericLiteral['extra']['raw']
): LuaNumericLiteral => ({
  type: 'NumericLiteral',
  value,
  extra: raw && {
    raw,
  },
});

export const booleanLiteral = (
  value: LuaBooleanLiteral['value']
): LuaBooleanLiteral => ({
  type: 'BooleanLiteral',
  value,
});

export const stringLiteral = (
  value: LuaStringLiteral['value']
): LuaStringLiteral => ({
  type: 'StringLiteral',
  value,
});

export const callExpression = (
  callee: LuaCallExpression['callee'],
  args: LuaCallExpression['arguments']
): LuaCallExpression => ({
  type: 'CallExpression',
  callee,
  arguments: args,
});

export const identifier = (
  name: string,
  typeAnnotation?: LuaTypeAnnotation
): LuaIdentifier => ({
  type: 'Identifier',
  name,
  ...(typeAnnotation ? { typeAnnotation } : {}),
});

export const unaryExpression = (
  operator: LuaUnaryExpression['operator'],
  argument: LuaUnaryExpression['argument']
): LuaUnaryExpression => ({
  type: 'LuaUnaryExpression',
  operator,
  argument,
});

export const unaryVoidExpression = (
  argument: LuaUnaryVoidExpression['argument']
): LuaUnaryVoidExpression => ({
  type: 'LuaUnaryVoidExpression',
  argument,
});

export const unaryNegationExpression = (
  argument: LuaUnaryNegationExpression['argument']
): LuaUnaryNegationExpression => ({
  type: 'LuaUnaryNegationExpression',
  argument,
});

export const unhandledNode = (
  start: UnhandledNode['start'],
  end: UnhandledNode['end']
): UnhandledNode => ({
  type: 'UnhandledNode',
  start,
  end,
});

export const arrayConcat = (): LuaIdentifier => identifier('Array.concat');
export const arraySpread = (): LuaIdentifier => identifier('Array.spread');
export const objectAssign = (): LuaIdentifier => identifier('Object.assign');
