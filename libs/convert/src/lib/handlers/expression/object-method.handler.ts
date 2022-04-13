import {
  AssignmentPattern,
  ExportDefaultDeclaration,
  Expression,
  LVal,
  Noop,
  ObjectMethod,
  Statement,
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
  functionExpression,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaTypeAnnotation,
  nodeGroup,
  tableExpressionKeyField,
  tableKeyField,
} from '@js-to-lua/lua-types';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { IdentifierHandlerFunction } from './identifier-handler-types';
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
  >
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
      const handleParamsBody = createFunctionParamsBodyHandler(
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal
      );

      const functionParamsHandler = createFunctionParamsHandler(
        handleIdentifier,
        handleTypeAnnotation
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
              nodeGroup([
                ...handleParamsBody(source, config, node),
                ...node.body.body.map<LuaStatement>(
                  handleStatement(source, config)
                ),
              ]),
              node.returnType
                ? handleTypeAnnotation(source, config, node.returnType)
                : undefined
            )
          );
        default:
          return tableExpressionKeyField(
            handleObjectKeyExpression(source, config, node.key),
            functionExpression(
              params,
              nodeGroup([
                ...handleParamsBody(source, config, node),
                ...node.body.body.map<LuaStatement>(
                  handleStatement(source, config)
                ),
              ]),
              node.returnType
                ? handleTypeAnnotation(source, config, node.returnType)
                : undefined
            )
          );
      }
    }
  );
};