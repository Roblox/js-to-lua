import {
  LuaBinaryExpression,
  LuaBooleanLiteral,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionExpression,
  LuaFunctionParam,
  LuaIdentifier,
  LuaIndexExpression,
  LuaLVal,
  LuaMemberExpression,
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
  LuaUnaryDeleteExpression,
  LuaVariableDeclaration,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  UnhandledNode,
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
  params: Array<LuaFunctionParam> = [],
  defaultValues: Array<any> = [],
  body: Array<LuaNode> = [],
  returnType: LuaTypeAnnotation = null
): LuaFunctionExpression => {
  if (returnType) {
    return {
      type: 'FunctionExpression',
      params,
      defaultValues, //TODO: should be <LuaAssignmentPattern>, but it's not available yet
      body,
      returnType,
    };
  }
  return {
    type: 'FunctionExpression',
    params,
    defaultValues, //TODO: should be <LuaAssignmentPattern>, but it's not available yet
    body,
  };
};

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
  argument: LuaUnaryNegationExpression['argument'],
  extra: LuaUnaryNegationExpression['extra']
): LuaUnaryNegationExpression => ({
  type: 'LuaUnaryNegationExpression',
  argument,
  extra,
});

export const unaryDeleteExpression = (
  argument: LuaUnaryDeleteExpression['argument']
): LuaUnaryDeleteExpression => ({
  type: 'LuaUnaryDeleteExpression',
  argument,
});

export const memberExpression = (
  base: LuaMemberExpression['base'],
  indexer: LuaMemberExpression['indexer'],
  identifier: LuaMemberExpression['identifier']
): LuaMemberExpression => ({
  type: 'LuaMemberExpression',
  base,
  indexer,
  identifier,
});

export const indexExpression = (
  base: LuaIndexExpression['base'],
  index: LuaIndexExpression['index']
): LuaIndexExpression => ({
  type: 'IndexExpression',
  base,
  index,
  ...(index.type === 'NumericLiteral'
    ? { conversionComment: 'ROBLOX adaptation: added 1 to array index' }
    : {}),
});

export const binaryExpression = (
  left: LuaBinaryExpression['left'],
  operator: LuaBinaryExpression['operator'],
  right: LuaBinaryExpression['right']
): LuaBinaryExpression => ({
  type: 'LuaBinaryExpression',
  left,
  operator,
  right,
});

export const unhandledNode = (
  start: UnhandledNode['start'] = 0,
  end: UnhandledNode['end'] = 0
): UnhandledNode => ({
  type: 'UnhandledNode',
  start,
  end,
});

export const arrayConcat = (): LuaMemberExpression =>
  memberExpression(identifier('Array'), '.', identifier('concat'));
export const arraySpread = (): LuaMemberExpression =>
  memberExpression(identifier('Array'), '.', identifier('spread'));
export const objectAssign = (): LuaMemberExpression =>
  memberExpression(identifier('Object'), '.', identifier('assign'));
