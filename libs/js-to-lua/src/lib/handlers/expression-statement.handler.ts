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
  isCallExpression as isBabelCallExpression,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  MemberExpression,
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
  expressionStatement,
  functionExpression,
  identifier,
  isIdentifier,
  LuaCallExpression,
  LuaExpression,
  LuaExpressionStatement,
  LuaFunctionExpression,
  LuaIdentifier,
  LuaStatement,
  LuaTableKeyField,
  memberExpression,
  numericLiteral,
  returnStatement,
  stringLiteral,
  tableExpressionKeyField,
  tableNameKeyField,
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
import { defaultExpressionHandler } from '../utils/default-handlers';
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
import { createCalleeExpressionHandlerFunction } from './expression/callee-expression.handler';
import { createNewExpressionHandler } from './expression/new-expression.handler';
import { createTsAsExpressionHandler } from './expression/ts-as-expression.handler';
import { createThisExpressionHandler } from './expression/this-expression.handler';
import { createObjectExpressionHandler } from './expression/object-expression.handler';
import { createTsNonNullExpressionHandler } from './expression/ts-non-null-expression.handler';
import { createTaggedTemplateExpressionHandler } from './expression/tagged-template-expression.handler';

type MemberExpressionPredicate = (node: MemberExpression) => boolean;
const isExpectCall = (node: MemberExpression): boolean => {
  return (
    isBabelCallExpression(node.object) &&
    isBabelIdentifier(node.object.callee) &&
    node.object.callee.name === 'expect'
  );
};

const isNestedExpectCall = (node: MemberExpression): boolean => {
  return (
    isBabelMemberExpression(node.object) &&
    (isExpectCall(node.object) || isNestedExpectCall(node.object))
  );
};

export const USE_DOT_NOTATION_IN_CALL_EXPRESSION: Array<
  string | MemberExpressionPredicate
> = ['React', isExpectCall, isNestedExpectCall];

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
  (source, config, statement: ExpressionStatement): LuaExpressionStatement =>
    expressionStatement(
      combineExpressionsHandlers([
        createAssignmentStatementHandlerFunction(
          forwardHandlerRef(() => handleExpression),
          handleLVal,
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
        typeof identifierName === 'string'
          ? matchesMemberExpressionObject(
              identifierName,
              expression.callee as MemberExpression
            )
          : identifierName(expression.callee as MemberExpression)
      )
    ) {
      return callExpression(
        handleCalleeExpression(source, config, expression.callee),
        expression.arguments.map(handleExpression.handler(source, config))
      );
    }

    if (
      matchesMemberExpressionProperty('toString', expression.callee) &&
      !expression.arguments.length
    ) {
      return callExpression(identifier('tostring'), [
        handleCalleeExpression(source, config, expression.callee.object),
      ]);
    }

    if (expression.callee.computed) {
      return callExpression(
        handleCalleeExpression(source, config, expression.callee),
        [
          handleCalleeExpression(source, config, expression.callee.object),
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

export const handleFunctionExpression: BaseNodeHandler<
  LuaFunctionExpression,
  FunctionExpression
> = createHandler('FunctionExpression', (source, config, node) => {
  const handleParamsBody = createFunctionParamsBodyHandler(
    forwardHandlerRef(() => handleDeclaration),
    handleAssignmentPattern
  );

  return functionExpression(
    functionParamsHandler(source, config, node),
    [
      ...handleParamsBody(source, config, node),
      ...node.body.body.map<LuaStatement>(
        handleStatement.handler(source, config)
      ),
    ],
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
    handleAssignmentPattern
  );
  return functionExpression(
    functionParamsHandler(source, config, node),
    [...handleParamsBody(source, config, node), ...handleFunctionBody(node)],
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
            assignmentStatement(
              node.operator === '++'
                ? AssignmentStatementOperatorEnum.ADD
                : AssignmentStatementOperatorEnum.SUB,
              [handleExpression.handler(source, config, node.argument)],
              [numericLiteral(1)]
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
  createMultilineStringLiteralHandler(
    forwardHandlerRef(() => handleExpression)
  ),
  createThisExpressionHandler(),
  handleBooleanLiteral,
  handleNullLiteral,
  createArrayExpressionHandler(forwardHandlerRef(() => handleExpression)),
  handleCallExpression,
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
  createConditionalExpressionHandler(forwardHandlerRef(() => handleExpression)),
  createSequenceExpressionHandler(
    forwardHandlerRef(() => handleExpressionAsStatement)
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
]);

const { typesHandler, handleTsTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => typesHandler)
);

const functionParamsHandler = createFunctionParamsHandler(
  forwardHandlerRef(() => handleIdentifier)
);

export const handleExpressionAsStatement: BaseNodeHandler<
  LuaExpression | LuaStatement,
  Expression
> = combineExpressionsHandlers([
  createAssignmentStatementHandlerFunction(
    forwardHandlerRef(() => handleExpression),
    handleLVal,
    forwardHandlerRef(() => handleObjectField),
    createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression))
      .handler
  ),
  createSequenceExpressionAsStatementHandler(
    forwardHandlerRef(() => handleExpressionAsStatement)
  ),
  handleExpression,
]);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleExpressionAsStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  handleTsTypes
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

export const handleObjectPropertyIdentifier = createHandlerFunction<
  LuaExpression,
  Identifier
>((source, config, node) => {
  const identifierResult = handleIdentifier.handler(source, config, node);

  if (typeof identifierResult?.extras?.originalIdentifierName === 'string') {
    return stringLiteral(identifierResult.extras.originalIdentifierName);
  }

  return isIdentifier(identifierResult)
    ? identifierResult
    : defaultExpressionHandler(source, config, node);
});

function tableKeyField(
  computed: boolean,
  key: LuaExpression,
  value: LuaExpression
) {
  return computed || !isIdentifier(key)
    ? tableExpressionKeyField(key, value)
    : tableNameKeyField(key, value);
}

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
          handleObjectPropertyIdentifier(source, config, key),
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
    const { key, computed } = node;
    const handleParamsBody = createFunctionParamsBodyHandler(
      forwardHandlerRef(() => handleDeclaration),
      handleAssignmentPattern
    );

    const params = [
      identifier('self'),
      ...functionParamsHandler(source, config, node),
    ];
    switch (key.type) {
      case 'Identifier':
        return tableKeyField(
          computed,
          handleObjectPropertyIdentifier(source, config, key),
          functionExpression(
            params,
            [
              ...handleParamsBody(source, config, node),
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
              ...handleParamsBody(source, config, node),
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

const handleCalleeExpression = createCalleeExpressionHandlerFunction(
  forwardHandlerRef(() => handleExpression)
);

export const handleStatement: BaseNodeHandler<LuaStatement> = combineStatementHandlers<LuaStatement>(
  [
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
    createThrowStatementHandler(forwardHandlerRef(() => handleExpression)),
    createTryStatementHandler(
      forwardHandlerRef(() => handleStatement),
      forwardHandlerRef(() => handleIdentifier)
    ),
    createSwitchStatementHandler(
      forwardHandlerRef(() => handleStatement),
      forwardHandlerRef(() => handleExpression)
    ),
    createBreakStatementHandler(),
  ]
);

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
