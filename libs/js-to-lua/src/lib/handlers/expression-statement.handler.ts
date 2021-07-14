import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import {
  ArrowFunctionExpression,
  AssignmentPattern,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  isAssignmentPattern as isBabelAssignmentPattern_,
  isSpreadElement as isBabelSpreadElement,
  MemberExpression,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
  UpdateExpression,
  V8IntrinsicIdentifier,
} from '@babel/types';
import {
  combineExpressionsHandlers,
  combineHandlers,
  combineStatementHandlers,
} from '../utils/combine-handlers';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { handleNullLiteral } from './primitives/null.handler';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  memberExpression,
  objectAssign,
  returnStatement,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

import { handleMultilineStringLiteral } from './primitives/multiline-string.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';
import { createFunctionParamsHandler } from './function-params.handler';
import { createReturnStatementHandler } from './statement/return-statement.handler';
import { createArrayExpressionHandler } from './array-expression.handler';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '../utils/forward-handler-ref';
import { createMemberExpressionHandler } from './member-expression.handler';
import { createUnaryExpressionHandler } from './unary-expression.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';
import { handleBigIntLiteral } from './primitives/big-int.handler';
import { createLogicalExpressionHandler } from './logical-expression.handler';
import { defaultExpressionHandler } from '../utils/default-handlers';
import { createAssignmentPatternHandlerFunction } from './statement/assignment-pattern.handler';
import { createAssignmentExpressionHandlerFunction } from './statement/assignment-expression.handler';
import { createAssignmentStatementHandlerFunction } from './statement/assignment-statement.handler';
import { createBlockStatementHandler } from './block-statement.handler';
import { createIdentifierHandler } from './identifier.handler';
import { createIfStatementHandler } from './if-statement.handler';
import { splitBy, Unpacked } from '@js-to-lua/shared-utils';
import { createDeclarationHandler } from './declaration.handler';
import { createLValHandler } from './l-val.handler';
import { createThrowStatementHandler } from './statement/throw-statement.handler';
import { createConditionalExpressionHandler } from './expression/conditional-expression.handler';
import { createTryStatementHandler } from './statement/try-statement.handler';

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION = ['React'];

type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;
type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;
const isBabelAssignmentPattern = (param: unknown): param is AssignmentPattern =>
  isBabelAssignmentPattern_(param as any);

export const handleExpressionStatement = createHandler(
  'ExpressionStatement',
  (source, config, statement: ExpressionStatement): LuaExpressionStatement =>
    expressionStatement(
      combineExpressionsHandlers([
        createAssignmentStatementHandlerFunction(
          forwardHandlerRef(() => handleExpression),
          createLValHandler(
            forwardHandlerRef(() => handleIdentifier),
            forwardHandlerRef(() => handleExpression)
          ).handler,
          forwardHandlerRef(() => handleObjectField),
          createBinaryExpressionHandler(
            forwardHandlerRef(() => handleExpression)
          ).handler
        ),
        handleExpressionAsStatement,
      ]).handler(source, config, statement.expression)
    )
);

export const handleCallExpression = createHandler(
  'CallExpression',
  (source, config, expression: CallExpression): LuaCallExpression => {
    if (
      expression.callee.type !== 'MemberExpression' ||
      USE_DOT_NOTATION_IN_CALL_EXPRESSION.some((identifierName) =>
        matchesMemberExpressionObject(
          identifierName,
          expression.callee as MemberExpression
        )
      )
    ) {
      return callExpression(
        handleCalleeExpression.handler(source, config, expression.callee),
        expression.arguments.map(handleExpression.handler(source, config))
      );
    }

    if (
      matchesMemberExpressionProperty('toString', expression.callee) &&
      !expression.arguments.length
    ) {
      return callExpression(identifier('tostring'), [
        handleCalleeExpression.handler(
          source,
          config,
          expression.callee.object
        ),
      ]);
    }

    if (expression.callee.computed) {
      return callExpression(
        handleCalleeExpression.handler(source, config, expression.callee),
        [
          handleCalleeExpression.handler(
            source,
            config,
            expression.callee.object
          ),
          ...(expression.arguments.map(
            handleExpression.handler(source, config)
          ) as LuaExpression[]),
        ]
      );
    }

    return callExpression(
      memberExpression(
        handleExpression.handler(source, config, expression.callee.object),
        ':',
        handleExpression.handler(
          source,
          config,
          expression.callee.property as Expression
        ) as LuaIdentifier
      ),
      expression.arguments.map(handleExpression.handler(source, config))
    );
  }
);

const handleObjectExpressionWithSpread = createHandlerFunction(
  (source, config, expression: ObjectExpression): LuaCallExpression => {
    const propertiesGroups = expression.properties.reduce(
      splitBy<ObjectExpressionProperty, SpreadElement>(isBabelSpreadElement),
      []
    );
    const args: LuaExpression[] = propertiesGroups.map((group) => {
      return Array.isArray(group)
        ? {
            type: 'TableConstructor',
            elements: group.map(handleObjectField.handler(source, config)),
          }
        : handleExpression.handler(source, config, group.argument);
    });

    return callExpression(objectAssign(), [tableConstructor([]), ...args]);
  }
);

const handleObjectExpressionWithoutSpread = createHandlerFunction(
  (source, config, expression: ObjectExpression): LuaTableConstructor => ({
    type: 'TableConstructor',
    elements: expression.properties.map(
      handleObjectField.handler(source, config)
    ),
  })
);

export const handleObjectExpression = createHandler(
  'ObjectExpression',
  (source, config, expression: ObjectExpression) =>
    expression.properties.every((prop) => prop.type !== 'SpreadElement')
      ? handleObjectExpressionWithoutSpread(source, config, expression)
      : handleObjectExpressionWithSpread(source, config, expression)
);

export const handleFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, config, node) =>
  functionExpression(
    node.params.map(functionParamsHandler(source, config)),
    [
      ...node.params
        .filter(isBabelAssignmentPattern)
        .map((param) => handleAssignmentPattern(source, config, param)),
      ...node.body.body.map<LuaStatement>(
        handleStatement.handler(source, config)
      ),
    ],
    node.returnType ? typesHandler(source, config, node.returnType) : undefined
  )
);

export const handleArrowFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  ArrowFunctionExpression
> = createHandler('ArrowFunctionExpression', (source, config, node) => {
  const body: LuaStatement[] =
    node.body.type === 'BlockStatement'
      ? node.body.body.map(handleStatement.handler(source, config))
      : [returnStatement(handleExpression.handler(source, config, node.body))];

  return functionExpression(
    node.params.map(functionParamsHandler(source, config)),
    [
      ...node.params
        .filter(isBabelAssignmentPattern)
        .map((param) => handleAssignmentPattern(source, config, param)),
      ...body,
    ],
    node.returnType ? typesHandler(source, config, node.returnType) : undefined
  );
});

export const handleUpdateExpression: BaseNodeHandler<
  LuaCallExpression,
  UpdateExpression
> = createHandler('UpdateExpression', (source, config, node) => {
  const resultName = generateUniqueIdentifier([node.argument], 'result');
  return callExpression(
    node.prefix
      ? functionExpression(
          [],
          [
            // TODO: must ve replaced by assignementstatement or similar when available
            handleExpression.handler(
              source,
              config,
              handlePrefixOperator(node)
            ),
            returnStatement(
              handleExpression.handler(source, config, node.argument)
            ),
          ]
        )
      : functionExpression(
          [],
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier(resultName))],
              [
                variableDeclaratorValue(
                  handleExpression.handler(source, config, node.argument)
                ),
              ]
            ),
            // TODO: must ve replaced by assignementstatement or similar when available
            handleExpression.handler(
              source,
              config,
              handleSuffixOperator(node)
            ),
            returnStatement(identifier(resultName)),
          ]
        ),
    []
  );
});

export const handleExpression: BaseNodeHandler<
  LuaExpression,
  Expression
> = combineExpressionsHandlers<LuaExpression, Expression>([
  handleNumericLiteral,
  handleBigIntLiteral,
  handleStringLiteral,
  handleMultilineStringLiteral,
  handleBooleanLiteral,
  handleNullLiteral,
  createArrayExpressionHandler(forwardHandlerRef(() => handleExpression)),
  handleCallExpression,
  handleObjectExpression,
  createIdentifierHandler(forwardHandlerFunctionRef(() => typesHandler)),
  createUnaryExpressionHandler(forwardHandlerRef(() => handleExpression)),
  createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression)),
  createLogicalExpressionHandler(forwardHandlerRef(() => handleExpression)),
  handleFunctionExpression,
  handleArrowFunctionExpression,
  handleUpdateExpression,
  createMemberExpressionHandler(forwardHandlerRef(() => handleExpression)),
  createAssignmentExpressionHandlerFunction(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier),
    forwardHandlerRef(() => handleObjectField),
    createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression))
      .handler
  ),
  createConditionalExpressionHandler(forwardHandlerRef(() => handleExpression)),
]);

const { typesHandler, handleTsTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const functionParamsHandler = createFunctionParamsHandler(
  forwardHandlerRef(() => handleIdentifier)
).handler;

const handleExpressionAsStatement = combineExpressionsHandlers([
  createAssignmentStatementHandlerFunction(
    forwardHandlerRef(() => handleExpression),
    createLValHandler(
      forwardHandlerRef(() => handleIdentifier),
      forwardHandlerRef(() => handleExpression)
    ).handler,
    forwardHandlerRef(() => handleObjectField),
    createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression))
      .handler
  ),
  handleExpression,
]);

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

export const handleObjectValueFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, config, node) => {
  const handleParam = functionParamsHandler(source, config);
  const params = [identifier('self'), ...node.params.map(handleParam)];

  return functionExpression(
    params,
    [
      ...node.params
        .filter(isBabelAssignmentPattern)
        .map((param) => handleAssignmentPattern(source, config, param)),
      ...node.body.body.map<LuaStatement>(
        handleStatement.handler(source, config)
      ),
    ],
    node.returnType ? typesHandler(source, config, node.returnType) : undefined
  );
});

const handleObjectPropertyValue: BaseNodeHandler<
  LuaExpression,
  Expression | PatternLike
> = combineExpressionsHandlers([
  handleObjectValueFunctionExpression,
  handleExpression,
]);

const handleObjectKeyExpression: HandlerFunction<
  LuaExpression,
  Expression
> = createHandlerFunction((source, config, key: Expression) =>
  key.type === 'StringLiteral'
    ? handleExpression.handler(source, config, key)
    : callExpression(
        {
          type: 'Identifier',
          name: 'tostring',
        },
        [handleExpression.handler(source, config, key)]
      )
);

export const handleObjectProperty: BaseNodeHandler<
  LuaTableKeyField,
  ObjectProperty
> = createHandler(
  'ObjectProperty',
  (source, config, { key, value, computed }) => {
    switch (key.type) {
      case 'Identifier':
        return computed
          ? tableExpressionKeyField(
              handleIdentifier.handler(source, config, key) as LuaIdentifier,
              handleObjectPropertyValue.handler(source, config, value)
            )
          : tableNameKeyField(
              handleIdentifier.handler(source, config, key) as LuaIdentifier,
              handleObjectPropertyValue.handler(source, config, value)
            );
      default:
        return tableExpressionKeyField(
          handleObjectKeyExpression(source, config, key),
          handleObjectPropertyValue.handler(source, config, value)
        );
    }
  }
);

export const handleObjectMethod: BaseNodeHandler<
  LuaTableKeyField,
  ObjectMethod
> = createHandler(
  'ObjectMethod',
  (source, config, node): LuaTableKeyField => {
    const handleParam = functionParamsHandler(source, config);
    const params = [identifier('self'), ...node.params.map(handleParam)];
    switch (node.key.type) {
      case 'Identifier':
        return tableNameKeyField(
          handleIdentifier.handler(source, config, node.key) as LuaIdentifier,
          functionExpression(
            params,
            [
              ...node.params
                .filter(isBabelAssignmentPattern)
                .map((param) => handleAssignmentPattern(source, config, param)),
              ...node.body.body.map<LuaStatement>(
                handleStatement.handler(source, config)
              ),
            ],
            node.returnType
              ? typesHandler(source, config, node.returnType)
              : undefined
          )
        );
      default:
        return tableExpressionKeyField(
          handleObjectKeyExpression(source, config, node.key),
          functionExpression(
            params,
            [
              ...node.params
                .filter(isBabelAssignmentPattern)
                .map((param) => handleAssignmentPattern(source, config, param)),
              ...node.body.body.map<LuaStatement>(
                handleStatement.handler(source, config)
              ),
            ],
            node.returnType
              ? typesHandler(source, config, node.returnType)
              : undefined
          )
        );
    }
  }
);

export const handleObjectField = combineHandlers<
  LuaTableKeyField,
  NoSpreadObjectProperty
>([handleObjectProperty, handleObjectMethod], defaultExpressionHandler);

const handleCalleeExpression = combineExpressionsHandlers<
  LuaExpression,
  Expression | V8IntrinsicIdentifier
>([handleExpression]);

export const handleStatement: BaseNodeHandler<LuaStatement> = combineStatementHandlers<LuaStatement>(
  [
    handleExpressionStatement,
    createDeclarationHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleIdentifier),
      forwardHandlerRef(() => handleStatement),
      handleTsTypes,
      forwardHandlerRef(() => handleObjectField)
    ),
    createBlockStatementHandler(forwardHandlerRef(() => handleStatement)),
    createReturnStatementHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleExpressionAsStatement)
    ),
    createIfStatementHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleStatement)
    ),
    createThrowStatementHandler(forwardHandlerRef(() => handleExpression)),
    createTryStatementHandler(
      forwardHandlerRef(() => handleStatement),
      functionParamsHandler
    ),
  ]
);

// TODO: temporary method, remove later
function handlePrefixOperator(node: UpdateExpression): Expression {
  const temp = { ...node.argument };
  ((temp as unknown) as LuaIdentifier).name +=
    node.operator === '++' ? ' += 1' : ' -= 1';
  return temp;
}

// TODO: temporary method, remove later
function handleSuffixOperator(node: UpdateExpression): Expression {
  ((node.argument as unknown) as LuaIdentifier).name +=
    node.operator === '++' ? ' += 1' : ' -= 1';
  return node.argument;
}

function generateUniqueIdentifier(
  nodes: Expression[],
  defaultValue: string
): string {
  return nodes
    .filter((node) => node.type === 'Identifier')
    .some((node) => (node as Identifier).name === defaultValue)
    ? generateUniqueIdentifier(nodes, `${defaultValue}_`)
    : defaultValue;
}

function matchesMemberExpressionProperty(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    (!node.computed &&
      node.property.type === 'Identifier' &&
      node.property.name === identifierName) ||
    (node.computed &&
      node.property.type === 'StringLiteral' &&
      node.property.value === identifierName)
  );
}

function matchesMemberExpressionObject(
  identifierName: string,
  node: MemberExpression
): boolean {
  return (
    node.object.type === 'Identifier' && node.object.name === identifierName
  );
}
