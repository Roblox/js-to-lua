import { isTruthy } from '@js-to-lua/shared-utils';
import { curry } from 'ramda';
import { commentBlock, LuaComment } from './comment';
import { identifier, LuaIdentifier } from './expression';
import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaElseClause,
  LuaElseifClause,
  LuaExpressionStatement,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIfClause,
  LuaIfStatement,
  LuaIndexExpression,
  LuaLogicalExpression,
  LuaMemberExpression,
  LuaNode,
  LuaProgram,
  LuaReturnStatement,
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
} from './lua-nodes.types';
import { BaseLuaNode } from './node.types';
import { nodeGroup } from './statement';

export const program = (body: LuaProgram['body'] = []): LuaProgram => ({
  type: 'Program',
  body,
});

export const expressionStatement = (
  expression: LuaExpressionStatement['expression']
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
  body: LuaFunctionExpression['body'] = nodeGroup([]),
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
  body: LuaFunctionDeclaration['body'] = nodeGroup([]),
  returnType: LuaFunctionDeclaration['returnType'] = undefined,
  isLocal: LuaFunctionDeclaration['isLocal'] = true
): LuaFunctionDeclaration => {
  if (returnType) {
    return {
      type: 'FunctionDeclaration',
      id,
      params,
      body,
      returnType,
      isLocal,
    };
  }
  return {
    type: 'FunctionDeclaration',
    id,
    params,
    body,
    isLocal,
  };
};

export const callExpression = (
  callee: LuaCallExpression['callee'],
  args: LuaCallExpression['arguments']
): LuaCallExpression => ({
  type: 'CallExpression',
  callee,
  arguments: args,
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

export const unhandledStatement = (): UnhandledStatement => ({
  type: 'UnhandledStatement',
});

export const unhandledExpression = (): UnhandledExpression => ({
  type: 'UnhandledExpression',
});

export const unhandledElement = (): UnhandledElement => ({
  type: 'UnhandledElement',
});

const trimValueAndWrapWithSpaces = (comment: LuaComment): LuaComment => {
  return {
    ...comment,
    value: ` ${comment.value.trim()} `,
  };
};

export const withTrailingConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const trailingComments = Array<LuaComment>().concat(
    ...[
      node.trailingComments,
      conversionComments
        .filter(isTruthy)
        .map((comment) =>
          trimValueAndWrapWithSpaces(
            commentBlock(comment, 'SameLineTrailingComment')
          )
        ),
    ].filter(isTruthy)
  );

  return {
    ...node,
    ...(trailingComments.length
      ? {
          trailingComments: trailingComments,
        }
      : {}),
  };
};

export const withInnerConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const innerComments = Array<LuaComment>().concat(
    ...[
      node.innerComments,
      conversionComments
        .filter(isTruthy)
        .map((comment) =>
          trimValueAndWrapWithSpaces(
            commentBlock(comment, 'SameLineInnerComment')
          )
        ),
    ].filter(isTruthy)
  );
  return {
    ...node,
    ...(innerComments.length ? { innerComments: innerComments } : {}),
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

export type PolyfillID =
  | 'Array'
  | 'Boolean'
  | 'Map'
  | 'Number'
  | 'Object'
  | 'Set'
  | 'String'
  | 'Symbol'
  | 'WeakMap'
  | 'clearTimeout'
  | 'console'
  | 'setTimeout';

export const isPolyfillID = (
  id: string,
  validPolyfills: PolyfillID[]
): id is PolyfillID => validPolyfills.includes(id as PolyfillID);

export const withPolyfillExtra = (polyfillIdentifier: PolyfillID) =>
  withExtras({
    needsPackages: true,
    [`polyfill.${polyfillIdentifier}`]: true,
  });

export const hasPolyfillExtra = (
  polyfillIdentifier: PolyfillID,
  node: LuaNode
) => node.extras?.sourceType === `polyfill.${polyfillIdentifier}`;

type BooleanMethod = 'toJSBoolean';
export const booleanIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Boolean')(identifier('Boolean'));
export const booleanMethod = (methodName: BooleanMethod): LuaMemberExpression =>
  memberExpression(booleanIdentifier(), '.', identifier(methodName));

export const bit32Identifier = (): LuaIdentifier => identifier('bit32');

export const arrayPolyfilledMethodNames = [
  'concat',
  'every',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'from',
  'includes',
  'indexOf',
  'join',
  'map',
  'reduce',
  'reverse',
  // 'shift' is handled separately
  'slice',
  'some',
  'sort',
  'splice',
  // 'unshift' is handled separately
] as const;

export type ArrayPolyfilledMethodName =
  | typeof arrayPolyfilledMethodNames[number]
  | 'shift'
  | 'unshift';

export const arrayIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Array')(identifier('Array'));
export const arrayMethod = (
  methodName: ArrayPolyfilledMethodName
): LuaMemberExpression =>
  memberExpression(arrayIdentifier(), '.', identifier(methodName));
export const arrayConcat = (): LuaMemberExpression => arrayMethod('concat');
export const arraySpread = (): LuaMemberExpression =>
  memberExpression(arrayIdentifier(), '.', identifier('spread'));
export const arrayIndexOf = (): LuaMemberExpression => arrayMethod('indexOf');

export const objectIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Object')(identifier('Object'));
export const objectAssign = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('assign'));
export const objectKeys = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('keys'));

export const objectNone = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('None'));

export const selfIdentifier = (): LuaIdentifier => identifier('self');
