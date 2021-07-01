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
  Declaration,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  isAssignmentPattern,
  isSpreadElement,
  MemberExpression,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
  UpdateExpression,
  V8IntrinsicIdentifier,
  VariableDeclaration,
  VariableDeclarator,
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
  functionDeclaration,
  functionExpression,
  identifier,
  LuaCallExpression,
  LuaDeclaration,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionDeclaration,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaNodeGroup,
  LuaStatement,
  LuaTableConstructor,
  LuaTableField,
  LuaTableKeyField,
  LuaVariableDeclaration,
  LuaVariableDeclarator,
  memberExpression,
  nodeGroup,
  objectAssign,
  returnStatement,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  UnhandledStatement,
  unhandledStatement,
  variableDeclaration,
  variableDeclarator,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withConversionComment,
} from '@js-to-lua/lua-types';

import { handleMultilineStringLiteral } from './primitives/multiline-string.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';
import { createFunctionParamsHandler } from './function-params.handler';
import { createLValHandler } from './l-val.handler';
import { createTypeAliasDeclarationHandler } from './type-alias-declaration.handler';
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

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION = ['React'];

type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;
type ObjectExpressionProperty = Unpacked<ObjectExpression['properties']>;

export const handleExpressionStatement = createHandler(
  'ExpressionStatement',
  (source, statement: ExpressionStatement): LuaExpressionStatement =>
    expressionStatement(
      combineExpressionsHandlers([
        createAssignmentStatementHandlerFunction(
          forwardHandlerRef(() => handleExpression),
          forwardHandlerRef(() => handleIdentifier)
        ),
        handleExpressionAsStatement,
      ]).handler(source, statement.expression)
    )
);

export const handleCallExpression = createHandler(
  'CallExpression',
  (source, expression: CallExpression): LuaCallExpression => {
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
        handleCalleeExpression.handler(source, expression.callee),
        expression.arguments.map(handleExpression.handler(source))
      );
    }

    if (
      matchesMemberExpressionProperty('toString', expression.callee) &&
      !expression.arguments.length
    ) {
      return callExpression(identifier('tostring'), [
        handleCalleeExpression.handler(source, expression.callee.object),
      ]);
    }

    if (expression.callee.computed) {
      return callExpression(
        handleCalleeExpression.handler(source, expression.callee),
        [
          handleCalleeExpression.handler(source, expression.callee.object),
          ...(expression.arguments.map(
            handleExpression.handler(source)
          ) as LuaExpression[]),
        ]
      );
    }

    return callExpression(
      memberExpression(
        handleExpression.handler(source, expression.callee.object),
        ':',
        handleExpression.handler(
          source,
          expression.callee.property as Expression
        ) as LuaIdentifier
      ),
      expression.arguments.map(handleExpression.handler(source))
    );
  }
);

const handleObjectExpressionWithSpread = createHandlerFunction(
  (source, expression: ObjectExpression): LuaCallExpression => {
    const propertiesGroups = expression.properties.reduce(
      splitBy<ObjectExpressionProperty, SpreadElement>(isSpreadElement),
      []
    );
    const args: LuaExpression[] = propertiesGroups.map((group) => {
      return Array.isArray(group)
        ? {
            type: 'TableConstructor',
            elements: group.map(handleObjectField.handler(source)),
          }
        : handleExpression.handler(source, group.argument);
    });

    return callExpression(objectAssign(), [tableConstructor([]), ...args]);
  }
);

const handleObjectExpressionWithoutSpread = createHandlerFunction(
  (source, expression: ObjectExpression): LuaTableConstructor => ({
    type: 'TableConstructor',
    elements: expression.properties.map(handleObjectField.handler(source)),
  })
);

export const handleObjectExpression = createHandler(
  'ObjectExpression',
  (source, expression: ObjectExpression) =>
    expression.properties.every((prop) => prop.type !== 'SpreadElement')
      ? handleObjectExpressionWithoutSpread(source, expression)
      : handleObjectExpressionWithSpread(source, expression)
);

export const handleFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, node) =>
  functionExpression(
    node.params.map(functionParamsHandler(source)),
    [
      ...node.params
        .filter((param) => isAssignmentPattern(param))
        .map((param: AssignmentPattern) =>
          handleAssignmentPattern(source, param)
        ),
      ...node.body.body.map<LuaStatement>(handleStatement.handler(source)),
    ],
    node.returnType ? typesHandler(source, node.returnType) : undefined
  )
);

export const handleArrowFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  ArrowFunctionExpression
> = createHandler('ArrowFunctionExpression', (source, node) => {
  const body: LuaStatement[] =
    node.body.type === 'BlockStatement'
      ? node.body.body.map(handleStatement.handler(source))
      : [returnStatement(handleExpression.handler(source, node.body))];

  return functionExpression(
    node.params.map(functionParamsHandler(source)),
    [
      ...node.params
        .filter((param) => isAssignmentPattern(param))
        .map((param: AssignmentPattern) =>
          handleAssignmentPattern(source, param)
        ),
      ...body,
    ],
    node.returnType ? typesHandler(source, node.returnType) : undefined
  );
});

export const handleUpdateExpression: BaseNodeHandler<
  LuaCallExpression,
  UpdateExpression
> = createHandler('UpdateExpression', (source, node) => {
  const resultName = generateUniqueIdentifier([node.argument], 'result');
  return callExpression(
    node.prefix
      ? functionExpression(
          [],
          [
            // TODO: must ve replaced by assignementstatement or similar when available
            handleExpression.handler(source, handlePrefixOperator(node)),
            returnStatement(handleExpression.handler(source, node.argument)),
          ]
        )
      : functionExpression(
          [],
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier(resultName))],
              [
                variableDeclaratorValue(
                  handleExpression.handler(source, node.argument)
                ),
              ]
            ),
            // TODO: must ve replaced by assignementstatement or similar when available
            handleExpression.handler(source, handleSuffixOperator(node)),
            returnStatement(identifier(resultName)),
          ]
        ),
    []
  );
});

export const handleExpression: BaseNodeHandler<
  LuaExpression,
  Expression
> = combineExpressionsHandlers<
  LuaExpression,
  BaseNodeHandler<LuaExpression, Expression>
>([
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
  createMemberExpressionHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
  ),
  createAssignmentExpressionHandlerFunction(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
  ),
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

const lValHandler = createLValHandler(forwardHandlerRef(() => handleIdentifier))
  .handler;

const handleExpressionAsStatement = combineExpressionsHandlers([
  createAssignmentStatementHandlerFunction(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
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
> = createHandler('FunctionExpression', (source, node) => {
  const handleParam = functionParamsHandler(source);
  const params = [identifier('self'), ...node.params.map(handleParam)];

  return functionExpression(
    params,
    [
      ...node.params
        .filter((param) => isAssignmentPattern(param))
        .map((param: AssignmentPattern) =>
          handleAssignmentPattern(source, param)
        ),
      ...node.body.body.map<LuaStatement>(handleStatement.handler(source)),
    ],
    node.returnType ? typesHandler(source, node.returnType) : undefined
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
> = createHandlerFunction((source, key: Expression) =>
  key.type === 'StringLiteral'
    ? handleExpression.handler(source, key)
    : callExpression(
        {
          type: 'Identifier',
          name: 'tostring',
        },
        [handleExpression.handler(source, key)]
      )
);

export const handleObjectProperty: BaseNodeHandler<
  LuaTableKeyField,
  ObjectProperty
> = createHandler('ObjectProperty', (source, { key, value }) => {
  switch (key.type) {
    case 'Identifier':
      return tableNameKeyField(
        handleIdentifier.handler(source, key) as LuaIdentifier,
        handleObjectPropertyValue.handler(source, value)
      );
    default:
      return tableExpressionKeyField(
        handleObjectKeyExpression(source, key),
        handleObjectPropertyValue.handler(source, value)
      );
  }
});

export const handleObjectMethod: BaseNodeHandler<
  LuaTableKeyField,
  ObjectMethod
> = createHandler(
  'ObjectMethod',
  (source, node): LuaTableKeyField => {
    const handleParam = functionParamsHandler(source);
    const params = [identifier('self'), ...node.params.map(handleParam)];
    switch (node.key.type) {
      case 'Identifier':
        return tableNameKeyField(
          handleIdentifier.handler(source, node.key) as LuaIdentifier,
          functionExpression(
            params,
            [
              ...node.params
                .filter((param) => isAssignmentPattern(param))
                .map((param: AssignmentPattern) =>
                  handleAssignmentPattern(source, param)
                ),
              ...node.body.body.map<LuaStatement>(
                handleStatement.handler(source)
              ),
            ],
            node.returnType ? typesHandler(source, node.returnType) : undefined
          )
        );
      default:
        return tableExpressionKeyField(
          handleObjectKeyExpression(source, node.key),
          functionExpression(
            params,
            [
              ...node.params
                .filter((param) => isAssignmentPattern(param))
                .map((param: AssignmentPattern) =>
                  handleAssignmentPattern(source, param)
                ),
              ...node.body.body.map<LuaStatement>(
                handleStatement.handler(source)
              ),
            ],
            node.returnType ? typesHandler(source, node.returnType) : undefined
          )
        );
    }
  }
);

export const handleObjectField = combineHandlers<
  LuaTableField,
  BaseNodeHandler<LuaTableField, NoSpreadObjectProperty>
>([handleObjectProperty, handleObjectMethod], defaultExpressionHandler);

const handleCalleeExpression = combineExpressionsHandlers<
  LuaExpression,
  BaseNodeHandler<LuaExpression, Expression | V8IntrinsicIdentifier>
>([handleExpression]);

const handleVariableDeclarator: BaseNodeHandler<
  LuaVariableDeclarator,
  VariableDeclarator
> = createHandler('VariableDeclarator', (source, node: VariableDeclarator) => {
  return variableDeclarator(
    lValHandler(source, node.id),
    node.init ? handleExpression.handler(source, node.init) : null
  );
});

export const handleVariableDeclaration: BaseNodeHandler<
  LuaNodeGroup | LuaVariableDeclaration,
  VariableDeclaration
> = createHandler('VariableDeclaration', (source, declaration) => {
  const handleDeclaration = handleVariableDeclarator.handler(source);
  const isFunctionDeclaration = (declaration: VariableDeclarator) =>
    declaration.init &&
    ['FunctionExpression', 'ArrowFunctionExpression'].includes(
      declaration.init.type
    );

  const isNotFunctionDeclaration = (declaration: VariableDeclarator) =>
    !isFunctionDeclaration(declaration);

  const varDeclaration: LuaVariableDeclaration = {
    type: 'VariableDeclaration',
    ...declaration.declarations
      .filter(isNotFunctionDeclaration)
      .map(handleDeclaration)
      .reduceRight<Pick<LuaVariableDeclaration, 'identifiers' | 'values'>>(
        (obj, declarator) => {
          obj.identifiers.unshift(variableDeclaratorIdentifier(declarator.id));
          if (declarator.init !== null || obj.values.length > 0) {
            obj.values.unshift(variableDeclaratorValue(declarator.init));
          }
          return obj;
        },
        { identifiers: [], values: [] }
      ),
  };

  const toFunctionDeclaration = convertVariableFunctionToFunctionDeclaration(
    source
  );
  const functionDeclarations = declaration.declarations
    .filter(isFunctionDeclaration)
    .map(toFunctionDeclaration);

  if (functionDeclarations.length === 0) {
    return varDeclaration;
  }

  if (varDeclaration.identifiers.length) {
    return nodeGroup([varDeclaration, ...functionDeclarations]);
  }

  return nodeGroup(functionDeclarations);
});

const convertVariableFunctionToFunctionDeclaration: HandlerFunction<
  LuaFunctionDeclaration | UnhandledStatement,
  VariableDeclarator
> = createHandlerFunction((source, node: VariableDeclarator) => {
  switch (node.init?.type) {
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return convertToFunctionDeclaration(
        source,
        node.init,
        lValHandler(source, node.id) as LuaIdentifier
      );
    default:
      return withConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.init?.type}, when within 'init' expression for ${node.type} node`,
        source.slice(node.start || 0, node.end || 0)
      );
  }
});

const convertToFunctionDeclaration = (
  source: string,
  node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
  identifier: LuaIdentifier
): LuaFunctionDeclaration => {
  const body: LuaStatement[] =
    node.body.type === 'BlockStatement'
      ? node.body.body.map(handleStatement.handler(source))
      : [returnStatement(handleExpression.handler(source, node.body))];

  return functionDeclaration(
    identifier,
    node.params.map(functionParamsHandler(source)),
    [
      ...node.params
        .filter((param) => isAssignmentPattern(param))
        .map((param: AssignmentPattern) =>
          handleAssignmentPattern(source, param)
        ),
      ...body,
    ],
    node.returnType ? typesHandler(source, node.returnType) : undefined
  );
};

export const handleFunctionDeclaration: BaseNodeHandler<
  LuaFunctionDeclaration,
  FunctionDeclaration
> = createHandler('FunctionDeclaration', (source, node) => {
  return convertToFunctionDeclaration(
    source,
    node,
    handleIdentifier.handler(source, node.id!) as LuaIdentifier
  );
});

export const handleDeclaration = combineStatementHandlers<
  LuaDeclaration | LuaNodeGroup,
  BaseNodeHandler<LuaDeclaration | LuaNodeGroup, Declaration>
>([
  handleVariableDeclaration,
  handleFunctionDeclaration,
  createTypeAliasDeclarationHandler(
    forwardHandlerRef(() => handleIdentifier),
    forwardHandlerRef(() => handleTsTypes)
  ),
]);

export const handleStatement = combineStatementHandlers<LuaStatement>([
  handleExpressionStatement,
  handleDeclaration,
  createBlockStatementHandler(forwardHandlerRef(() => handleStatement)),
  createReturnStatementHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleExpressionAsStatement)
  ),
  createIfStatementHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleStatement)
  ),
]);

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
