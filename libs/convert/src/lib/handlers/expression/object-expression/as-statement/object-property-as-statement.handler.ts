import * as Babel from '@babel/types';
import {
  asStatementReturnTypeInline,
  BaseNodeAsStatementHandler,
  BaseNodeHandler,
  createAsStatementHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { asStatementReturnTypeToReturn } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  LuaType,
  LuaTypeAnnotation,
  tableConstructor,
  tableExpressionKeyField,
  tableKeyField,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../../identifier-handler-types';
import { createObjectKeyExpressionHandler } from '../object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from '../object-property-identifier.handler';
import { createObjectPropertyValueAsStatementHandler } from './object-property-value-as-statement.handler';

export const createObjectPropertyAsStatementHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Babel.Expression>,
  expressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaStatement,
    Babel.Expression
  >,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<Babel.ExportDefaultDeclaration['declaration'], Babel.Expression>
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    Babel.AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const handleObjectPropertyIdentifier =
    createObjectPropertyIdentifierHandler(handleIdentifier);
  const handleObjectPropertyValueAsStatement =
    createObjectPropertyValueAsStatementHandler(
      expressionAsStatementHandler,
      handleStatement,
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );
  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    expressionHandler.handler
  );
  return createAsStatementHandler<
    LuaStatement,
    Babel.ObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >('ObjectProperty', (source, config, { key, value, computed }) => {
    const propertyValue = asStatementReturnTypeToReturn(
      handleObjectPropertyValueAsStatement(source, config, value)
    );
    if (Babel.isIdentifier(key) && !computed) {
      return asStatementReturnTypeInline(
        propertyValue.preStatements,
        tableConstructor([
          tableKeyField(
            computed,
            handleObjectPropertyIdentifier(source, config, key),
            propertyValue.toReturn
          ),
        ]),
        propertyValue.postStatements
      );
    } else {
      return asStatementReturnTypeInline(
        propertyValue.preStatements,
        tableConstructor([
          tableExpressionKeyField(
            handleObjectKeyExpression(source, config, key),
            propertyValue.toReturn
          ),
        ]),
        propertyValue.postStatements
      );
    }
  });
};
