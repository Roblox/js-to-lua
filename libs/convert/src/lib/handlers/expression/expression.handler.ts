import { AssignmentExpression, Expression, Statement } from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  BaseNodeAsStatementHandler,
  BaseNodeHandler,
  combineAsStatementHandlers,
  createAsStatementHandler,
  forwardAsStatementHandlerRef,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  combineExpressionsHandlers,
  defaultExpressionAsStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { createDeclarationHandler } from '../declaration/declaration.handler';
import { createLValHandler } from '../l-val.handler';
import { handleBigIntLiteral } from '../primitives/big-int.handler';
import { handleBooleanLiteral } from '../primitives/boolean.handler';
import { handleNullLiteral } from '../primitives/null.handler';
import { handleNumericLiteral } from '../primitives/numeric.handler';
import { createStringLiteralHandler } from '../primitives/string.handler';
import { createTemplateLiteralHandler } from '../primitives/template-literal.handler';
import { createAssignmentExpressionHandlerFunction } from '../statement/assignment/assignment-expression.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment/assignment-pattern.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createArrayExpressionHandler } from './array-expression.handler';
import { createArrowExpressionHandler } from './arrow-expression.handler';
import { createAwaitExpressionHandler } from './await-expression.handler';
import { createBinaryExpressionHandler } from './binary-expression/binary-expression.handler';
import { createCallExpressionAsStatementHandler } from './call/call-expression-as-statement.handler';
import { createCallExpressionHandler } from './call/call-expression.handler';
import {
  createOptionalCallExpressionAsStatementHandler,
  createOptionalCallExpressionHandler,
} from './call/optional-call-expression.handler';
import { createConditionalExpressionHandler } from './conditional-expression.handler';
import { createFlowTypeCastExpressionHandler } from './flow-type-cast.handler';
import { createFunctionExpressionHandler } from './function-expression.handler';
import {
  IdentifierHandlerFunction,
  IdentifierStrictHandlerFunction,
} from './identifier-handler-types';
import { createIdentifierHandler } from './identifier.handler';
import {
  createLogicalExpressionAsStatementHandler,
  createLogicalExpressionHandler,
} from './logical-expression/logical-expression.handler';
import { createMemberExpressionHandler } from './member-expression.handler';
import { createNewExpressionHandler } from './new-expression.handler';
import { createObjectExpressionAsStatementHandler } from './object-expression/as-statement/object-expression-as-statement.handler';
import { createObjectExpressionHandler } from './object-expression/object-expression.handler';
import { NoSpreadObjectProperty } from './object-expression/object-expression.types';
import { createObjectKeyExpressionHandler } from './object-expression/object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './object-expression/object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './object-expression/object-property-value.handler';
import { createOptionalMemberExpressionHandler } from './optional-member-expression.handler';
import { createSequenceExpressionAsStatementHandler } from './sequence-expression-as-statement.handler';
import { createSequenceExpressionHandler } from './sequence-expression.handler';
import { createTaggedTemplateExpressionHandler } from './tagged-template-expression.handler';
import { createThisExpressionHandler } from './this-expression.handler';
import { createTsAsExpressionHandler } from './ts-as-expression.handler';
import { createTsNonNullExpressionHandler } from './ts-non-null-expression.handler';
import {
  createUnaryExpressionAsStatementHandler,
  createUnaryExpressionHandler,
} from './unary-expression.handler';
import {
  createUpdateExpressionAsStatementHandler,
  createUpdateExpressionHandler,
} from './update-expression.handler';

export const createExpressionHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleIdentifier: IdentifierHandlerFunction,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<LuaTableKeyField, NoSpreadObjectProperty>,
  handleObjectFieldAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >,
  assignmentExpressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaNodeGroup | LuaStatement,
    AssignmentExpression
  >
) => {
  const forwardedHandleExpression = forwardHandlerRef(() => expressionHandler);
  const forwardedHandleExpressionAsStatement = forwardAsStatementHandlerRef(
    () => handleExpressionAsStatement
  );
  const forwardedHandleTypeAnnotation = forwardHandlerFunctionRef(
    () => handleTypeAnnotation
  );
  const forwardedHandleType = forwardHandlerRef(() => handleType);
  const forwardedHandleObjectPropertyValue = forwardHandlerFunctionRef(
    () => handleObjectPropertyValue
  );

  const { handleTypeAnnotation, handleType } = createTypeAnnotationHandler(
    forwardedHandleExpression,
    handleIdentifierStrict
  );

  const handleLVal = createLValHandler(
    handleIdentifier,
    forwardedHandleExpression
  ).handler;

  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    forwardedHandleExpression
  );

  const handleDeclaration = createDeclarationHandler(
    forwardedHandleExpression,
    forwardedHandleExpressionAsStatement,
    handleIdentifier,
    handleIdentifierStrict,
    handleStatement,
    handleObjectField,
    createObjectPropertyIdentifierHandler(handleIdentifier),
    handleObjectKeyExpression,
    forwardedHandleObjectPropertyValue,
    handleLVal
  ).handler;

  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    forwardedHandleExpression,
    handleIdentifier
  );

  const expressionHandler: BaseNodeHandler<LuaExpression, Expression> =
    combineExpressionsHandlers<LuaExpression, Expression>([
      handleNumericLiteral,
      handleBigIntLiteral,
      createStringLiteralHandler(),
      createTemplateLiteralHandler(forwardedHandleExpression),
      createThisExpressionHandler(),
      handleBooleanLiteral,
      handleNullLiteral,
      createArrayExpressionHandler(forwardedHandleExpression),
      createCallExpressionHandler(forwardedHandleExpression),
      createObjectExpressionHandler(
        forwardedHandleExpression,
        handleObjectField
      ),
      createIdentifierHandler(forwardedHandleTypeAnnotation),
      createUnaryExpressionHandler(forwardedHandleExpression),
      createBinaryExpressionHandler(forwardedHandleExpression),
      createLogicalExpressionHandler(forwardedHandleExpressionAsStatement),
      createOptionalMemberExpressionHandler(forwardedHandleExpression),
      createFunctionExpressionHandler(
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal,
        handleIdentifier,
        forwardedHandleTypeAnnotation,
        forwardedHandleType,
        handleStatement,
        forwardedHandleExpressionAsStatement
      ),
      createArrowExpressionHandler(
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal,
        handleIdentifier,
        forwardedHandleTypeAnnotation,
        forwardedHandleType,
        handleStatement,
        forwardedHandleExpressionAsStatement
      ),
      createUpdateExpressionHandler(forwardedHandleExpression),
      createMemberExpressionHandler(forwardedHandleExpression),
      createAssignmentExpressionHandlerFunction(
        forwardedHandleExpression,
        forwardedHandleExpressionAsStatement,
        handleLVal,
        handleIdentifierStrict,
        handleObjectField,
        createBinaryExpressionHandler(forwardedHandleExpression).handler
      ),
      createConditionalExpressionHandler(forwardedHandleExpression),
      createSequenceExpressionHandler(forwardedHandleExpressionAsStatement),
      createNewExpressionHandler(forwardedHandleExpression),
      createTsAsExpressionHandler(
        forwardedHandleExpression,
        forwardedHandleType
      ),
      createFlowTypeCastExpressionHandler(
        forwardedHandleExpression,
        forwardedHandleType
      ),
      createTsNonNullExpressionHandler(forwardedHandleExpression),
      createTaggedTemplateExpressionHandler(
        forwardedHandleExpression,
        createTemplateLiteralHandler(forwardedHandleExpression).handler
      ),
      createAwaitExpressionHandler(forwardedHandleExpression),
      createOptionalCallExpressionHandler(forwardedHandleExpression),
    ]);

  const handleObjectPropertyValue = createObjectPropertyValueHandler(
    expressionHandler,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType.handler
  );

  const handleExpressionAsStatement = createExpressionAsStatementHandler(
    expressionHandler,
    assignmentExpressionAsStatementHandler,
    handleObjectFieldAsStatement
  );

  return expressionHandler;
};

export const createExpressionAsStatementHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  assignmentExpressionAsStatement: BaseNodeAsStatementHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  >,
  handleObjectFieldAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >
) => {
  const forwardedExpressionHandlerAsStatementHandlerFunction =
      forwardAsStatementHandlerRef(() => handleExpressionAsStatement),
    handleExpressionAsStatement: BaseNodeAsStatementHandler<
      LuaStatement,
      Expression
    > = combineAsStatementHandlers<LuaStatement, Expression>(
      [
        assignmentExpressionAsStatement,
        createSequenceExpressionAsStatementHandler(
          forwardedExpressionHandlerAsStatementHandlerFunction
        ),
        createUpdateExpressionAsStatementHandler(expressionHandler.handler),
        createUnaryExpressionAsStatementHandler(expressionHandler.handler),
        createLogicalExpressionAsStatementHandler(
          forwardedExpressionHandlerAsStatementHandlerFunction
        ),
        createOptionalCallExpressionAsStatementHandler(
          expressionHandler.handler
        ),
        createObjectExpressionAsStatementHandler(
          expressionHandler.handler,
          handleObjectFieldAsStatement
        ),
        createCallExpressionAsStatementHandler(
          expressionHandler.handler,
          forwardedExpressionHandlerAsStatementHandlerFunction
        ),
        // This is a fallback handler. Put any specific handlers before
        createAsStatementHandler<LuaStatement, Expression>(
          expressionHandler.type,
          (source, config, expression) =>
            asStatementReturnTypeInline(
              [],
              expressionHandler.handler(source, config, expression),
              []
            ),
          { skipComments: true }
        ),
      ],
      defaultExpressionAsStatementHandler
    );

  return handleExpressionAsStatement;
};
