import { createForStatementHandler } from './statement/for-statement.handler';
import { BaseNodeHandler, createHandler } from '../types';
import {
  ArrowFunctionExpression,
  AssignmentPattern,
  Expression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  isAssignmentPattern as isBabelAssignmentPattern_,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  SpreadElement,
  UpdateExpression,
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
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionExpression,
  identifier,
  isExpression,
  isIdentifier,
  LuaCallExpression,
  LuaExpression,
  LuaFunctionExpression,
  LuaStatement,
  LuaTableKeyField,
  nodeGroup,
  numericLiteral,
  returnStatement,
  stringLiteral,
  tableExpressionKeyField,
  tableKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

import { createMultilineStringLiteralHandler } from './primitives/multiline-string.handler';
import { createTypeAnnotationHandler } from './type/type-annotation.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from './function-params.handler';
import { createReturnStatementHandler } from './statement/return-statement.handler';
import { createArrayExpressionHandler } from './expression/array-expression.handler';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '../utils/forward-handler-ref';
import { createMemberExpressionHandler } from './expression/member-expression.handler';
import { createUnaryExpressionHandler } from './expression/unary-expression.handler';
import { createBinaryExpressionHandler } from './expression/binary-expression.handler';
import { handleBigIntLiteral } from './primitives/big-int.handler';
import { createLogicalExpressionHandler } from './expression/logical-expression.handler';
import {
  defaultExpressionHandler,
  defaultStatementHandler,
} from '../utils/default-handlers';
import { createAssignmentPatternHandlerFunction } from './statement/assignment-pattern.handler';
import { createAssignmentExpressionHandlerFunction } from './statement/assignment-expression.handler';
import { createAssignmentStatementHandlerFunction } from './statement/assignment-statement.handler';
import { createBlockStatementHandler } from './statement/block-statement.handler';
import { createIdentifierHandler } from './expression/identifier.handler';
import { createIfStatementHandler } from './statement/if-statement.handler';
import { Unpacked } from '@js-to-lua/shared-utils';
import { createDeclarationHandler } from './declaration/declaration.handler';
import { createLValHandler } from './l-val.handler';
import { createThrowStatementHandler } from './statement/throw-statement.handler';
import { createConditionalExpressionHandler } from './expression/conditional-expression.handler';
import { createTryStatementHandler } from './statement/try-statement.handler';
import { createSwitchStatementHandler } from './statement/switch-statement.handler';
import { createBreakStatementHandler } from './statement/break-statement.handler';
import {
  createSequenceExpressionAsStatementHandler,
  createSequenceExpressionHandler,
} from './expression/sequence-expression.handler';
import { createFunctionBodyHandler } from './expression/function-body.handler';
import { createNewExpressionHandler } from './expression/new-expression.handler';
import { createTsAsExpressionHandler } from './expression/ts-as-expression.handler';
import { createThisExpressionHandler } from './expression/this-expression.handler';
import { createObjectExpressionHandler } from './expression/object-expression.handler';
import { createTsNonNullExpressionHandler } from './expression/ts-non-null-expression.handler';
import { createTaggedTemplateExpressionHandler } from './expression/tagged-template-expression.handler';
import { createAwaitExpressionHandler } from './expression/await-expression.handler';
import { createExpressionStatement } from '../utils/create-expression-statement';
import { createCallExpressionHandler } from './expression/call/call-expression.handler';

type NoSpreadObjectProperty = Exclude<
  Unpacked<ObjectExpression['properties']>,
  SpreadElement
>;
const isBabelAssignmentPattern = (param: unknown): param is AssignmentPattern =>
  isBabelAssignmentPattern_(param as any);

const handleLVal = createLValHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleExpression)
).handler;

export const handleExpressionStatement = createHandler(
  'ExpressionStatement',
  (source, config, statement: ExpressionStatement): LuaStatement => {
    const expression = combineHandlers(
      [
        createAssignmentStatementHandlerFunction(
          forwardHandlerRef(() => handleExpression),
          handleLVal,
          forwardHandlerRef(() => handleObjectField),
          createBinaryExpressionHandler(
            forwardHandlerRef(() => handleExpression)
          ).handler
        ),
        handleUpdateExpressionAsStatement,
        handleExpressionAsStatement,
      ],
      defaultExpressionHandler
    ).handler(source, config, statement.expression);

    const babelExpression = statement.expression;
    return isExpression(expression)
      ? createExpressionStatement(source, babelExpression, expression)
      : expression;
  }
);

export const handleFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, config, node) => {
  const handleFunctionBody = createFunctionBodyHandler(
    handleStatement.handler,
    handleExpressionAsStatement.handler
  )(source, config);
  const handleParamsBody = createFunctionParamsBodyHandler(
    forwardHandlerRef(() => handleDeclaration),
    handleAssignmentPattern,
    handleLVal
  );

  return functionExpression(
    functionParamsHandler(source, config, node),
    nodeGroup([
      ...handleParamsBody(source, config, node),
      ...handleFunctionBody(node),
    ]),
    node.returnType ? typesHandler(source, config, node.returnType) : undefined
  );
});

export const handleArrowFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  ArrowFunctionExpression
> = createHandler('ArrowFunctionExpression', (source, config, node) => {
  const handleFunctionBody = createFunctionBodyHandler(
    handleStatement.handler,
    handleExpressionAsStatement.handler
  )(source, config);
  const handleParamsBody = createFunctionParamsBodyHandler(
    forwardHandlerRef(() => handleDeclaration),
    handleAssignmentPattern,
    handleLVal
  );
  return functionExpression(
    functionParamsHandler(source, config, node),
    nodeGroup([
      ...handleParamsBody(source, config, node),
      ...handleFunctionBody(node),
    ]),
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
          nodeGroup([
            assignmentStatement(
              node.operator === '++'
                ? AssignmentStatementOperatorEnum.ADD
                : AssignmentStatementOperatorEnum.SUB,
              [handleExpression.handler(source, config, node.argument)],
              [numericLiteral(1)]
            ),
            returnStatement(
              handleExpression.handler(source, config, node.argument)
            ),
          ])
        )
      : functionExpression(
          [],
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier(resultName))],
              [
                variableDeclaratorValue(
                  handleExpression.handler(source, config, node.argument)
                ),
              ]
            ),
            assignmentStatement(
              node.operator === '++'
                ? AssignmentStatementOperatorEnum.ADD
                : AssignmentStatementOperatorEnum.SUB,
              [handleExpression.handler(source, config, node.argument)],
              [numericLiteral(1)]
            ),
            returnStatement(identifier(resultName)),
          ])
        ),
    []
  );
});

export const handleUpdateExpressionAsStatement: BaseNodeHandler<
  LuaCallExpression,
  UpdateExpression
> = createHandler('UpdateExpression', (source, config, node) => {
  return assignmentStatement(
    node.operator === '++'
      ? AssignmentStatementOperatorEnum.ADD
      : AssignmentStatementOperatorEnum.SUB,
    [handleExpression.handler(source, config, node.argument)],
    [numericLiteral(1)]
  );
});

export const handleExpression: BaseNodeHandler<LuaExpression, Expression> =
  combineExpressionsHandlers<LuaExpression, Expression>([
    handleNumericLiteral,
    handleBigIntLiteral,
    handleStringLiteral,
    createMultilineStringLiteralHandler(
      forwardHandlerRef(() => handleExpression)
    ),
    createThisExpressionHandler(),
    handleBooleanLiteral,
    handleNullLiteral,
    createArrayExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createCallExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createObjectExpressionHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleObjectField)
    ),
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
      handleLVal,
      forwardHandlerRef(() => handleObjectField),
      createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression))
        .handler
    ),
    createConditionalExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    ),
    createSequenceExpressionHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleExpressionAsStatement),
      forwardHandlerRef(() => handleUpdateExpressionAsStatement)
    ),
    createNewExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createTsAsExpressionHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleTsTypes)
    ),
    createTsNonNullExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createTaggedTemplateExpressionHandler(
      forwardHandlerRef(() => handleExpression),
      createMultilineStringLiteralHandler(
        forwardHandlerRef(() => handleExpression)
      ).handler
    ),
    createAwaitExpressionHandler(forwardHandlerRef(() => handleExpression)),
  ]);

const { typesHandler, handleTsTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const functionParamsHandler = createFunctionParamsHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerFunctionRef(() => typesHandler)
);

export const handleExpressionAsStatement: BaseNodeHandler<
  LuaExpression | LuaStatement,
  Expression
> = combineHandlers<LuaExpression | LuaStatement, Expression>(
  [
    createAssignmentStatementHandlerFunction(
      forwardHandlerRef(() => handleExpression),
      handleLVal,
      forwardHandlerRef(() => handleObjectField),
      createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression))
        .handler
    ),
    createSequenceExpressionAsStatementHandler(
      forwardHandlerRef(() => handleExpressionAsStatement),
      forwardHandlerRef(() => handleUpdateExpressionAsStatement)
    ),
    handleExpression,
  ],
  defaultStatementHandler
);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleExpressionAsStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  handleTsTypes,
  forwardHandlerRef(() => handleObjectPropertyIdentifier),
  forwardHandlerRef(() => handleObjectKeyExpression),
  forwardHandlerRef(() => handleObjectPropertyValue),
  handleLVal
);

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

export const handleObjectValueFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, config, node) => {
  const params = [
    identifier('self'),
    ...functionParamsHandler(source, config, node),
  ];

  return functionExpression(
    params,
    nodeGroup([
      ...node.params
        .filter(isBabelAssignmentPattern)
        .map((param) => handleAssignmentPattern(source, config, param)),
      ...node.body.body.map<LuaStatement>(
        handleStatement.handler(source, config)
      ),
    ]),
    node.returnType ? typesHandler(source, config, node.returnType) : undefined
  );
});

export const handleObjectPropertyValue: BaseNodeHandler<
  LuaExpression,
  Expression | PatternLike
> = combineExpressionsHandlers([
  handleObjectValueFunctionExpression,
  handleExpression,
]);

export const handleObjectKeyExpression: BaseNodeHandler<
  LuaExpression,
  Expression
> = createHandler([], (source, config, key: Expression) =>
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

export const handleObjectPropertyIdentifier = createHandler<
  LuaExpression,
  Identifier
>([], (source, config, node) => {
  const identifierResult = handleIdentifier.handler(source, config, node);

  if (typeof identifierResult?.extras?.originalIdentifierName === 'string') {
    return stringLiteral(identifierResult.extras.originalIdentifierName);
  }

  return isIdentifier(identifierResult)
    ? identifierResult
    : defaultExpressionHandler(source, config, node);
});

export const handleObjectProperty: BaseNodeHandler<
  LuaTableKeyField,
  ObjectProperty
> = createHandler(
  'ObjectProperty',
  (source, config, { key, value, computed }) => {
    switch (key.type) {
      case 'Identifier':
        return tableKeyField(
          computed,
          handleObjectPropertyIdentifier.handler(source, config, key),
          handleObjectPropertyValue.handler(source, config, value)
        );
      default:
        return tableExpressionKeyField(
          handleObjectKeyExpression.handler(source, config, key),
          handleObjectPropertyValue.handler(source, config, value)
        );
    }
  }
);

export const handleObjectMethod: BaseNodeHandler<
  LuaTableKeyField,
  ObjectMethod
> = createHandler('ObjectMethod', (source, config, node): LuaTableKeyField => {
  const { key, computed } = node;
  const handleParamsBody = createFunctionParamsBodyHandler(
    forwardHandlerRef(() => handleDeclaration),
    handleAssignmentPattern,
    handleLVal
  );

  const params = [
    identifier('self'),
    ...functionParamsHandler(source, config, node),
  ];
  switch (key.type) {
    case 'Identifier':
      return tableKeyField(
        computed,
        handleObjectPropertyIdentifier.handler(source, config, key),
        functionExpression(
          params,
          nodeGroup([
            ...handleParamsBody(source, config, node),
            ...node.body.body.map<LuaStatement>(
              handleStatement.handler(source, config)
            ),
          ]),
          node.returnType
            ? typesHandler(source, config, node.returnType)
            : undefined
        )
      );
    default:
      return tableExpressionKeyField(
        handleObjectKeyExpression.handler(source, config, node.key),
        functionExpression(
          params,
          nodeGroup([
            ...handleParamsBody(source, config, node),
            ...node.body.body.map<LuaStatement>(
              handleStatement.handler(source, config)
            ),
          ]),
          node.returnType
            ? typesHandler(source, config, node.returnType)
            : undefined
        )
      );
  }
});

export const handleObjectField = combineHandlers<
  LuaTableKeyField,
  NoSpreadObjectProperty
>([handleObjectProperty, handleObjectMethod], defaultExpressionHandler);

export const handleStatement: BaseNodeHandler<LuaStatement> =
  combineStatementHandlers<LuaStatement>([
    handleExpressionStatement,
    handleDeclaration,
    createBlockStatementHandler(forwardHandlerRef(() => handleStatement)),
    createForStatementHandler(
      forwardHandlerRef(() => handleStatement),
      forwardHandlerRef(() => handleExpressionAsStatement),
      forwardHandlerRef(() => handleUpdateExpressionAsStatement),
      handleExpression,
      handleDeclaration
    ),
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
      forwardHandlerRef(() => handleIdentifier),
      forwardHandlerFunctionRef(() => typesHandler)
    ),
    createSwitchStatementHandler(
      forwardHandlerRef(() => handleStatement),
      forwardHandlerRef(() => handleExpression)
    ),
    createBreakStatementHandler(),
  ]);

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
