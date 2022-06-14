import { AssignmentExpression, Expression, Statement } from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeAsStatementHandler,
  BaseNodeHandler,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { combineStatementHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { createDeclarationHandler } from '../declaration/declaration.handler';
import {
  IdentifierHandlerFunction,
  IdentifierStrictHandlerFunction,
} from '../expression/identifier-handler-types';
import { NoSpreadObjectProperty } from '../expression/object-expression/object-expression.types';
import { createObjectKeyExpressionHandler } from '../expression/object-expression/object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from '../expression/object-expression/object-property-identifier.handler';
import { createObjectPropertyValueHandler } from '../expression/object-expression/object-property-value.handler';
import { createLValHandler } from '../l-val.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createAssignmentPatternHandlerFunction } from './assignment/assignment-pattern.handler';
import { createBlockStatementHandler } from './block-statement.handler';
import { createBreakStatementHandler } from './break-statement.handler';
import { createContinueStatementHandler } from './continue-statement.handler';
import { createDoWhileStatementHandler } from './do-while-statement.handler';
import { createExpressionStatementHandler } from './expression-statement.handler';
import { createForOfStatementHandler } from './for-of-statement.handler';
import { createForStatementHandler } from './for-statement/for-statement.handler';
import { createIfStatementHandler } from './if-statement.handler';
import { createReturnStatementHandler } from './return-statement.handler';
import { createSwitchStatementHandler } from './switch-statement/switch-statement.handler';
import { createThrowStatementHandler } from './throw-statement.handler';
import { createTryStatementHandler } from './try-statement.handler';
import { createTsImportEqualsDeclarationHandler } from './ts-import-equals-declaration.handler';
import { createWhileStatementHandler } from './while-statement.handler';

export const createStatementHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleIdentifier: IdentifierHandlerFunction,
  handleObjectField: HandlerFunction<LuaTableKeyField, NoSpreadObjectProperty>,
  handleObjectFieldAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  assignmentExpressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaStatement,
    AssignmentExpression
  >
) => {
  const forwardedHandleExpression = forwardHandlerRef(() => expressionHandler);
  const forwardedHandleStatement = forwardHandlerRef(() => statementHandler);
  const forwardedHandleDeclaration = forwardHandlerRef(
    () => declarationHandler
  );
  const forwardedHandleObjectPropertyValue = forwardHandlerFunctionRef(
    () => handleObjectPropertyValue
  );
  const forwardedHandleTypeAnnotation = forwardHandlerFunctionRef(
    () => handleTypeAnnotation
  );
  const forwardedHandleType = forwardHandlerRef(() => handleType);

  const handleExpressionStatement = createExpressionStatementHandler(
    expressionHandler,
    assignmentExpressionAsStatementHandler,
    handleObjectFieldAsStatement
  );

  const { handleTypeAnnotation, handleType } = createTypeAnnotationHandler(
    forwardedHandleExpression,
    handleIdentifierStrict
  );

  const handleLVal = createLValHandler(
    handleIdentifier,
    forwardedHandleExpression
  ).handler;

  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    forwardedHandleExpression,
    handleIdentifier
  );

  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    forwardedHandleExpression
  );

  const handleObjectPropertyValue = createObjectPropertyValueHandler(
    expressionHandler,
    forwardedHandleStatement,
    handleIdentifier,
    forwardedHandleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType.handler
  );

  const declarationHandler = createDeclarationHandler(
    forwardedHandleExpression,
    handleExpressionAsStatement,
    handleIdentifier,
    handleIdentifierStrict,
    forwardedHandleStatement,
    handleObjectField,
    createObjectPropertyIdentifierHandler(handleIdentifier),
    handleObjectKeyExpression,
    forwardedHandleObjectPropertyValue,
    handleLVal
  );

  const statementHandler: BaseNodeHandler<LuaStatement, Statement> =
    combineStatementHandlers<LuaStatement, Statement>([
      handleExpressionStatement,
      declarationHandler,
      createBlockStatementHandler(forwardedHandleStatement),
      createForStatementHandler(
        forwardedHandleStatement,
        handleExpressionAsStatement,
        expressionHandler,
        declarationHandler
      ),
      createReturnStatementHandler(
        forwardedHandleExpression,
        handleExpressionAsStatement
      ),
      createIfStatementHandler(
        forwardedHandleExpression,
        forwardedHandleStatement
      ),
      createThrowStatementHandler(forwardedHandleExpression),
      createTryStatementHandler(
        forwardedHandleStatement,
        handleIdentifier,
        forwardedHandleTypeAnnotation,
        forwardedHandleType
      ),
      createSwitchStatementHandler(
        forwardedHandleStatement,
        forwardedHandleExpression,
        handleExpressionAsStatement
      ),
      createBreakStatementHandler(),
      createContinueStatementHandler(),
      createWhileStatementHandler(
        forwardedHandleExpression,
        forwardedHandleStatement
      ),
      createDoWhileStatementHandler(
        forwardedHandleExpression,
        forwardedHandleStatement
      ),
      createForOfStatementHandler(
        handleIdentifierStrict,
        forwardedHandleExpression,
        forwardedHandleStatement,
        handleLVal,
        handleObjectField
      ),
      createTsImportEqualsDeclarationHandler(handleIdentifier),
    ]);

  return statementHandler;
};
