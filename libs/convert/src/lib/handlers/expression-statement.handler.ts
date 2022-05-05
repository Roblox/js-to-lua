import {
  Expression,
  ExpressionStatement,
  Statement,
  UpdateExpression,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import {
  combineExpressionsHandlers,
  combineStatementHandlers,
  createExpressionStatement,
  defaultExpressionHandler,
  defaultStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionExpression,
  identifier,
  isExpression,
  LuaCallExpression,
  LuaExpression,
  LuaStatement,
  nodeGroup,
  numericLiteral,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { createDeclarationHandler } from './declaration/declaration.handler';
import { createArrayExpressionHandler } from './expression/array-expression.handler';
import { createArrowExpressionHandler } from './expression/arrow-expression.handler';
import { createAwaitExpressionHandler } from './expression/await-expression.handler';
import { createBinaryExpressionHandler } from './expression/binary-expression/binary-expression.handler';
import { createCallExpressionHandler } from './expression/call/call-expression.handler';
import { createConditionalExpressionHandler } from './expression/conditional-expression.handler';
import { createFlowTypeCastExpressionHandler } from './expression/flow-type-cast.handler';
import { createFunctionExpressionHandler } from './expression/function-expression.handler';
import {
  createIdentifierHandler,
  createIdentifierStrictHandler,
} from './expression/identifier.handler';
import { createLogicalExpressionHandler } from './expression/logical-expression.handler';
import { createMemberExpressionHandler } from './expression/member-expression.handler';
import { createNewExpressionHandler } from './expression/new-expression.handler';
import { createObjectExpressionHandler } from './expression/object-expression.handler';
import { createObjectFieldHandler } from './expression/object-field.handler';
import { createObjectKeyExpressionHandler } from './expression/object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './expression/object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './expression/object-property-value.handler';
import { createOptionalMemberExpressionHandler } from './expression/optional-member-expression.handler';
import {
  createSequenceExpressionAsStatementHandler,
  createSequenceExpressionHandler,
} from './expression/sequence-expression.handler';
import { createTaggedTemplateExpressionHandler } from './expression/tagged-template-expression.handler';
import { createThisExpressionHandler } from './expression/this-expression.handler';
import { createTsAsExpressionHandler } from './expression/ts-as-expression.handler';
import { createTsNonNullExpressionHandler } from './expression/ts-non-null-expression.handler';
import { createUnaryExpressionHandler } from './expression/unary-expression.handler';
import { generateUniqueIdentifier } from './generate-unique-identifier';
import { createLValHandler } from './l-val.handler';
import { handleBigIntLiteral } from './primitives/big-int.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { createMultilineStringLiteralHandler } from './primitives/multiline-string.handler';
import { handleNullLiteral } from './primitives/null.handler';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { createStringLiteralHandler } from './primitives/string.handler';
import { createAssignmentExpressionHandlerFunction } from './statement/assignment/assignment-expression.handler';
import { createAssignmentPatternHandlerFunction } from './statement/assignment/assignment-pattern.handler';
import { createAssignmentStatementHandlerFunction } from './statement/assignment/assignment-statement.handler';
import { createBlockStatementHandler } from './statement/block-statement.handler';
import { createBreakStatementHandler } from './statement/break-statement.handler';
import { createContinueStatementHandler } from './statement/continue-statement.handler';
import { createDoWhileStatementHandler } from './statement/do-while-statement.handler';
import { createForOfStatementHandler } from './statement/for-of-statement.handler';
import { createForStatementHandler } from './statement/for-statement.handler';
import { createIfStatementHandler } from './statement/if-statement.handler';
import { createReturnStatementHandler } from './statement/return-statement.handler';
import { createSwitchStatementHandler } from './statement/switch-statement.handler';
import { createThrowStatementHandler } from './statement/throw-statement.handler';
import { createTryStatementHandler } from './statement/try-statement.handler';
import { createTsImportEqualsDeclarationHandler } from './statement/ts-import-equals-declaration.handler';
import { createWhileStatementHandler } from './statement/while-statement.handler';
import { createTypeAnnotationHandler } from './type/type-annotation.handler';

const handleLVal = createLValHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleExpression)
).handler;

export const handleExpressionStatement = createHandler(
  'ExpressionStatement',
  (source, config, statement: ExpressionStatement): LuaStatement => {
    const { handler: handleExpressionStatementExpression } = combineHandlers(
      [
        createAssignmentStatementHandlerFunction(
          forwardHandlerRef(() => handleExpression),
          handleLVal,
          forwardHandlerRef(() => handleIdentifierStrict),
          forwardHandlerRef(() => handleObjectField),
          createBinaryExpressionHandler(
            forwardHandlerRef(() => handleExpression)
          ).handler
        ),
        handleUpdateExpressionAsStatement,
        handleExpressionAsStatement,
      ],
      defaultExpressionHandler
    );
    const expression = handleExpressionStatementExpression(
      source,
      config,
      statement.expression
    );

    const babelExpression = statement.expression;
    return isExpression(expression)
      ? createExpressionStatement(source, babelExpression, expression)
      : expression;
  }
);

export const handleUpdateExpression = createHandler<
  LuaCallExpression,
  UpdateExpression
>('UpdateExpression', (source, config, node) => {
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

export const handleUpdateExpressionAsStatement = createHandler<
  LuaStatement,
  UpdateExpression
>('UpdateExpression', (source, config, node) => {
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
    createStringLiteralHandler(),
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
    createIdentifierHandler(
      forwardHandlerFunctionRef(() => handleTypeAnnotation)
    ),
    createUnaryExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createBinaryExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createLogicalExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createOptionalMemberExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    ),
    createFunctionExpressionHandler(
      forwardHandlerRef(() => handleDeclaration),
      forwardHandlerFunctionRef(() => handleAssignmentPattern),
      handleLVal,
      forwardHandlerRef(() => handleIdentifier),
      forwardHandlerFunctionRef(() => handleTypeAnnotation),
      forwardHandlerRef(() => handleType)
    ),
    createArrowExpressionHandler(
      forwardHandlerRef(() => handleDeclaration),
      forwardHandlerFunctionRef(() => handleAssignmentPattern),
      handleLVal,
      forwardHandlerRef(() => handleIdentifier),
      forwardHandlerFunctionRef(() => handleTypeAnnotation),
      forwardHandlerRef(() => handleType)
    ),
    handleUpdateExpression,
    createMemberExpressionHandler(forwardHandlerRef(() => handleExpression)),
    createAssignmentExpressionHandlerFunction(
      forwardHandlerRef(() => handleExpression),
      handleLVal,
      forwardHandlerRef(() => handleIdentifierStrict),
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
      forwardHandlerRef(() => handleType)
    ),
    createFlowTypeCastExpressionHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleType)
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

const { handleTypeAnnotation, handleType } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifierStrict)
);

const handleIdentifier = createIdentifierHandler(
  forwardHandlerFunctionRef(() => handleTypeAnnotation)
);

const handleIdentifierStrict = createIdentifierStrictHandler(
  forwardHandlerFunctionRef(() => handleTypeAnnotation)
);

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

export const handleObjectField = createObjectFieldHandler(
  handleExpression,
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleDeclaration),
  handleAssignmentPattern,
  handleLVal,
  handleTypeAnnotation,
  handleType.handler
);

export const handleObjectKeyExpression = createObjectKeyExpressionHandler(
  handleExpression.handler
);

export const handleObjectPropertyValue = createObjectPropertyValueHandler(
  handleExpression,
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleDeclaration),
  handleAssignmentPattern,
  handleLVal,
  handleTypeAnnotation,
  handleType.handler
);

export const handleObjectPropertyIdentifier =
  createObjectPropertyIdentifierHandler(
    forwardHandlerRef(() => handleIdentifier)
  );

export const handleExpressionAsStatement: BaseNodeHandler<
  LuaExpression | LuaStatement,
  Expression
> = combineHandlers<LuaExpression | LuaStatement, Expression>(
  [
    createAssignmentStatementHandlerFunction(
      forwardHandlerRef(() => handleExpression),
      handleLVal,
      forwardHandlerRef(() => handleIdentifierStrict),
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
  forwardHandlerRef(() => handleIdentifierStrict),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  createObjectPropertyIdentifierHandler(
    forwardHandlerRef(() => handleIdentifier)
  ),
  handleObjectKeyExpression,
  handleObjectPropertyValue,
  handleLVal
);

export const handleStatement: BaseNodeHandler<LuaStatement, Statement> =
  combineStatementHandlers<LuaStatement, Statement>([
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
      forwardHandlerFunctionRef(() => handleTypeAnnotation),
      forwardHandlerRef(() => handleType)
    ),
    createSwitchStatementHandler(
      forwardHandlerRef(() => handleStatement),
      forwardHandlerRef(() => handleExpression)
    ),
    createBreakStatementHandler(),
    createContinueStatementHandler(),
    createWhileStatementHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleStatement)
    ),
    createDoWhileStatementHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleStatement)
    ),
    createForOfStatementHandler(
      forwardHandlerRef(() => handleIdentifierStrict),
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleStatement),
      handleLVal,
      forwardHandlerRef(() => handleObjectField)
    ),
    createTsImportEqualsDeclarationHandler(
      forwardHandlerRef(() => handleIdentifier)
    ),
  ]);
