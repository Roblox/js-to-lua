import {
  AssignmentPattern,
  ExportDefaultDeclaration,
  Expression,
  FlowType,
  LVal,
  Noop,
  ObjectMethod,
  Statement,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  functionExpressionMultipleReturn,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
  tableExpressionKeyField,
  tableKeyField,
} from '@js-to-lua/lua-types';
import { createFunctionParamsWithBodyHandler } from '../../function-params-with-body.handler';
import { createFunctionReturnTypeHandler } from '../../function-return-type.handler';
import { IdentifierHandlerFunction } from '../identifier-handler-types';
import { createObjectKeyExpressionHandler } from './object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './object-property-identifier.handler';

export const createObjectMethodHandler = (
  handleExpression: BaseNodeHandler<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<ExportDefaultDeclaration['declaration'], Expression>
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>
) => {
  const handleObjectPropertyIdentifier =
    createObjectPropertyIdentifierHandler(handleIdentifier);
  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    handleExpression.handler
  );

  return createHandler<LuaTableKeyField, ObjectMethod>(
    'ObjectMethod',
    (source, config, node) => {
      const { key, computed } = node;
      const handleParamsWithBody = createFunctionParamsWithBodyHandler(
        handleIdentifier,
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal,
        handleTypeAnnotation,
        handleType
      );

      const { params: functionParams, body: paramsBody } = handleParamsWithBody(
        source,
        config,
        node
      );
      const params = [identifier('self'), ...functionParams];

      const handleReturnType =
        createFunctionReturnTypeHandler(handleTypeAnnotation);
      const returnType = handleReturnType(source, config, node);

      switch (key.type) {
        case 'Identifier':
          return tableKeyField(
            computed,
            handleObjectPropertyIdentifier(source, config, key),
            functionExpressionMultipleReturn(
              params,
              nodeGroup([
                ...paramsBody,
                ...node.body.body.map<LuaStatement>(
                  handleStatement(source, config)
                ),
              ]),
              returnType
            )
          );
        default:
          return tableExpressionKeyField(
            handleObjectKeyExpression(source, config, node.key),
            functionExpressionMultipleReturn(
              params,
              nodeGroup([
                ...paramsBody,
                ...node.body.body.map<LuaStatement>(
                  handleStatement(source, config)
                ),
              ]),
              returnType
            )
          );
      }
    }
  );
};
