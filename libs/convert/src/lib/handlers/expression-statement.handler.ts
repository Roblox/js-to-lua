import {
  forwardAsStatementHandlerRef,
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { createDeclarationHandler } from './declaration/declaration.handler';
import { createBinaryExpressionHandler } from './expression/binary-expression/binary-expression.handler';
import {
  createExpressionAsStatementHandler,
  createExpressionHandler,
} from './expression/expression.handler';
import {
  createIdentifierHandler,
  createIdentifierStrictHandler,
} from './expression/identifier.handler';
import { createObjectFieldAsStatementHandler } from './expression/object-expression/as-statement/object-field-as-statement.handler';
import { createObjectFieldHandler } from './expression/object-expression/object-field.handler';
import { createObjectKeyExpressionHandler } from './expression/object-expression/object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './expression/object-expression/object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './expression/object-expression/object-property-value.handler';
import { createLValHandler } from './l-val.handler';
import { createAssignmentExpressionAsStatementHandlerFunction } from './statement/assignment/assignment-expression-as-statement.handler';
import { createAssignmentPatternHandlerFunction } from './statement/assignment/assignment-pattern.handler';
import { createStatementHandler } from './statement/statement.handler';
import { createTypeAnnotationHandler } from './type/type-annotation.handler';

const forwardedHandleIdentifier = forwardHandlerRef(() => identifierHandler);
const forwardedHandleDeclaration = forwardHandlerRef(() => declarationHandler);
const forwardedHandleStatement = forwardHandlerRef(() => statementHandler);
const forwardedHandleExpression = forwardHandlerRef(() => expressionHandler);
const forwardedHandleExpressionAsStatement = forwardAsStatementHandlerRef(
  () => expressionAsStatementHandler
);
const forwardedHandleIdentifierStrict = forwardHandlerRef(
  () => identifierStrictHandler
);
const forwardedHandleObjectField = forwardHandlerRef(() => objectFieldHandler);
const forwardedHandleObjectFieldAsStatement = forwardAsStatementHandlerRef(
  () => objectFieldAsStatementHandler
);
const forwardedHandleTypeAnnotation = forwardHandlerFunctionRef(
  () => handleTypeAnnotation
);
const forwardedHandleType = forwardHandlerRef(() => handleType);
const forwardedObjectKeyExpressionHandler = forwardHandlerFunctionRef(
  () => handleObjectKeyExpression
);
const forwardedObjectPropertyValueHandler = forwardHandlerFunctionRef(
  () => handleObjectPropertyValue
);
const forwardedHandleLVal = forwardHandlerRef(() => handleLVal);
const forwardedHandleAssignmentPattern = forwardHandlerFunctionRef(
  () => handleAssignmentPattern
);
const forwardedHandleObjectPropertyIdentifier = forwardHandlerFunctionRef(
  () => handleObjectPropertyIdentifier
);

const handleLVal = createLValHandler(
  forwardedHandleIdentifier,
  forwardedHandleExpression
);

const assignmentExpressionAsStatementHandler =
  createAssignmentExpressionAsStatementHandlerFunction(
    forwardedHandleExpression,
    forwardedHandleExpressionAsStatement,
    forwardedHandleLVal,
    forwardedHandleIdentifierStrict,
    forwardedHandleObjectField,
    createBinaryExpressionHandler(forwardedHandleExpression).handler
  );

const expressionHandler = createExpressionHandler(
  forwardedHandleIdentifierStrict,
  forwardedHandleIdentifier,
  forwardedHandleStatement,
  forwardedHandleObjectField,
  forwardedHandleObjectFieldAsStatement,
  assignmentExpressionAsStatementHandler
);

const { handleTypeAnnotation, handleType } = createTypeAnnotationHandler(
  forwardedHandleExpression,
  forwardedHandleIdentifierStrict
);

const identifierHandler = createIdentifierHandler(
  forwardedHandleTypeAnnotation
);

const identifierStrictHandler = createIdentifierStrictHandler(
  forwardedHandleTypeAnnotation
);

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  forwardedHandleExpression,
  forwardedHandleIdentifier
);

const declarationHandler = createDeclarationHandler(
  forwardedHandleExpression,
  forwardedHandleExpressionAsStatement,
  forwardedHandleIdentifier,
  forwardedHandleIdentifierStrict,
  forwardedHandleStatement,
  forwardedHandleObjectField,
  forwardedHandleObjectPropertyIdentifier,
  forwardedObjectKeyExpressionHandler,
  forwardedObjectPropertyValueHandler,
  forwardedHandleLVal
);

// -------- Exported for tests --------

export { expressionHandler };

export const expressionAsStatementHandler = createExpressionAsStatementHandler(
  expressionHandler,
  assignmentExpressionAsStatementHandler,
  forwardedHandleObjectFieldAsStatement
);

export const objectFieldHandler = createObjectFieldHandler(
  expressionHandler,
  forwardedHandleStatement,
  forwardedHandleIdentifier,
  forwardedHandleDeclaration,
  forwardedHandleAssignmentPattern,
  forwardedHandleLVal,
  forwardedHandleTypeAnnotation,
  forwardedHandleType
);

export const objectFieldAsStatementHandler =
  createObjectFieldAsStatementHandler(
    expressionHandler,
    expressionAsStatementHandler,
    forwardedHandleStatement,
    forwardedHandleIdentifier,
    forwardedHandleDeclaration,
    forwardedHandleAssignmentPattern,
    forwardedHandleLVal,
    forwardedHandleTypeAnnotation,
    forwardedHandleType
  );

export const handleObjectKeyExpression = createObjectKeyExpressionHandler(
  forwardedHandleExpression
);

export const statementHandler = createStatementHandler(
  forwardedHandleIdentifierStrict,
  forwardedHandleIdentifier,
  forwardedHandleObjectField,
  forwardedHandleObjectFieldAsStatement,
  forwardedHandleExpressionAsStatement,
  expressionHandler,
  assignmentExpressionAsStatementHandler
);

export const handleObjectPropertyValue = createObjectPropertyValueHandler(
  expressionHandler,
  forwardedHandleStatement,
  forwardedHandleIdentifier,
  forwardedHandleDeclaration,
  forwardedHandleAssignmentPattern,
  forwardedHandleLVal,
  forwardedHandleTypeAnnotation,
  forwardedHandleType
);

export const handleObjectPropertyIdentifier =
  createObjectPropertyIdentifierHandler(forwardedHandleIdentifier);
