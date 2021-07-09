import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaElseClause,
  LuaElseifClause,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaIfClause,
  LuaIfStatement,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
  LuaNode,
  LuaProgram,
  LuaPropertySignature,
  LuaReturnStatement,
  LuaTableConstructor,
  LuaTableExpressionKeyField,
  LuaTableNameKeyField,
  LuaTableNoKeyField,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  LuaTypeLiteral,
  LuaTypeString,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  LuaVariableDeclaration,
  LuaVariableDeclarator,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  UnhandledElement,
  UnhandledExpression,
  UnhandledStatement,
  UnhandledTypeAnnotation,
} from './lua-nodes.types';
import { BaseLuaNode } from './node.types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { curry } from 'ramda';

export const program = (body: LuaProgram['body'] = []): LuaProgram => ({
  type: 'Program',
  body,
});

export const expressionStatement = (
  expression: LuaExpression
): LuaExpressionStatement => ({
  type: 'ExpressionStatement',
  expression,
});

export const returnStatement = (
  ...arguments_: LuaReturnStatement['arguments']
): LuaReturnStatement => ({
  type: 'ReturnStatement',
  arguments: arguments_,
});

export const variableDeclaration = (
  identifiers: LuaVariableDeclaration['identifiers'],
  values: LuaVariableDeclaration['values']
): LuaVariableDeclaration => ({
  type: 'VariableDeclaration',
  identifiers,
  values,
});

export const variableDeclaratorIdentifier = (
  value: LuaVariableDeclaratorIdentifier['value']
): LuaVariableDeclaratorIdentifier => ({
  type: 'VariableDeclaratorIdentifier',
  value,
});

export const variableDeclaratorValue = (
  value: LuaVariableDeclaratorValue['value']
): LuaVariableDeclaratorValue => ({
  type: 'VariableDeclaratorValue',
  value,
});

export const variableDeclarator = (
  id: LuaVariableDeclarator['id'],
  init: LuaVariableDeclarator['init']
): LuaVariableDeclarator => ({
  type: 'VariableDeclarator',
  id,
  init,
});

export const functionExpression = (
  params: LuaFunctionExpression['params'] = [],
  body: LuaFunctionExpression['body'] = [],
  returnType: LuaFunctionExpression['returnType'] = undefined
): LuaFunctionExpression => {
  if (returnType) {
    return {
      type: 'FunctionExpression',
      params,
      body,
      returnType,
    };
  }
  return {
    type: 'FunctionExpression',
    params,
    body,
  };
};

export const functionDeclaration = (
  id: LuaFunctionDeclaration['id'],
  params: LuaFunctionDeclaration['params'] = [],
  body: LuaFunctionDeclaration['body'] = [],
  returnType: LuaFunctionDeclaration['returnType'] = undefined
): LuaFunctionDeclaration => {
  if (returnType) {
    return {
      type: 'FunctionDeclaration',
      id,
      params,
      body,
      returnType,
    };
  }
  return {
    type: 'FunctionDeclaration',
    id,
    params,
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
    ? { conversionComments: ['ROBLOX adaptation: added 1 to array index'] }
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

export const logicalExpression = (
  operator: LuaLogicalExpression['operator'],
  left: LuaLogicalExpression['left'],
  right: LuaLogicalExpression['right']
): LuaLogicalExpression => ({
  type: 'LogicalExpression',
  operator,
  left,
  right,
});

export const ifStatement = (
  ifClause: LuaIfStatement['ifClause'],
  elseifClauses?: LuaIfStatement['elseifClauses'],
  elseClause?: LuaIfStatement['elseClause']
): LuaIfStatement => ({
  type: 'LuaIfStatement',
  ifClause,
  ...(elseifClauses && elseifClauses.length ? { elseifClauses } : {}),
  ...(elseClause ? { elseClause } : {}),
});

export const ifClause = (
  condition: LuaIfClause['condition'],
  body: LuaIfClause['body']
): LuaIfClause => ({
  type: 'IfClause',
  condition,
  body,
});

export const elseifClause = (
  condition: LuaElseifClause['condition'],
  body: LuaElseifClause['body']
): LuaElseifClause => ({
  type: 'ElseifClause',
  condition,
  body,
});

export const elseClause = (body: LuaElseClause['body']): LuaElseClause => ({
  type: 'ElseClause',
  body,
});

export const typeAnnotation = (
  typeAnnotation?: LuaTypeAnnotation['typeAnnotation']
): LuaTypeAnnotation => ({
  type: 'LuaTypeAnnotation',
  typeAnnotation,
});

export const typeLiteral = (
  members: LuaTypeLiteral['members']
): LuaTypeLiteral => ({
  type: 'LuaTypeLiteral',
  members,
});

export const typeString = (): LuaTypeString => ({ type: 'LuaTypeString' });

export const propertySignature = (
  key: LuaPropertySignature['key'],
  typeAnnotation?: LuaPropertySignature['typeAnnotation']
): LuaPropertySignature => ({
  type: 'LuaPropertySignature',
  key,
  typeAnnotation,
});

export const typeAliasDeclaration = (
  id: LuaTypeAliasDeclaration['id'],
  typeAnnotation: LuaTypeAliasDeclaration['typeAnnotation']
): LuaTypeAliasDeclaration => ({
  type: 'LuaTypeAliasDeclaration',
  id,
  typeAnnotation,
});

export const unhandledStatement = (): UnhandledStatement => ({
  type: 'UnhandledStatement',
});

export const unhandledExpression = (): UnhandledExpression => ({
  type: 'UnhandledExpression',
});

export const unhandledTypeAnnotation = (): UnhandledTypeAnnotation => ({
  type: 'UnhandledTypeAnnotation',
});

export const unhandledElement = (): UnhandledElement => ({
  type: 'UnhandledElement',
});

export const withConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const _conversionComments = Array<string>().concat(
    ...[node.conversionComments, conversionComments.filter(isTruthy)].filter(
      isTruthy
    )
  );
  return {
    ...node,
    ...(_conversionComments.length
      ? { conversionComments: _conversionComments }
      : {}),
  };
};

export const withExtras = curry(
  <N extends LuaNode, E>(extras: E, node: N): N & { extras: E } => ({
    ...node,
    extras: {
      ...node.extras,
      ...extras,
    },
  })
);

type BooleanMethod = 'toJSBoolean';
export const booleanIdentifier = (): LuaIdentifier => identifier('Boolean');
export const booleanMethod = (methodName: BooleanMethod): LuaMemberExpression =>
  memberExpression(booleanIdentifier(), '.', identifier(methodName));

export const bit32Identifier = (): LuaIdentifier => identifier('bit32');

export const arrayConcat = (): LuaMemberExpression =>
  memberExpression(identifier('Array'), '.', identifier('concat'));
export const arraySpread = (): LuaMemberExpression =>
  memberExpression(identifier('Array'), '.', identifier('spread'));
export const arrayIndexOf = (): LuaMemberExpression =>
  memberExpression(identifier('Array'), '.', identifier('indexOf'));

export const objectAssign = (): LuaMemberExpression =>
  memberExpression(identifier('Object'), '.', identifier('assign'));
export const objectKeys = (): LuaMemberExpression =>
  memberExpression(identifier('Object'), '.', identifier('keys'));
