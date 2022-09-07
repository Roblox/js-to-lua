import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  functionExpressionMultipleReturn,
  identifier,
  LuaDeclaration,
  LuaFunctionExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { createFunctionParamsWithBodyHandler } from '../../function-params-with-body.handler';
import { createFunctionReturnTypeHandler } from '../../function-return-type.handler';
import { IdentifierHandlerFunction } from '../identifier-handler-types';

export const createObjectValueFunctionExpressionHandler = (
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
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
  return createHandler<LuaFunctionExpression, Babel.FunctionExpression>(
    'FunctionExpression',
    (source, config, node) => {
      const handleParamsWithBody = createFunctionParamsWithBodyHandler(
        handleIdentifier,
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal,
        handleTypeAnnotation,
        handleType
      );

      const { params, body: paramsBody } = handleParamsWithBody(
        source,
        config,
        node
      );
      const functionParams = [identifier('self'), ...params];

      const handleReturnType =
        createFunctionReturnTypeHandler(handleTypeAnnotation);
      const returnType = handleReturnType(source, config, node);

      return functionExpressionMultipleReturn(
        functionParams,
        nodeGroup([
          ...paramsBody,
          ...node.body.body.map<LuaStatement>(handleStatement(source, config)),
        ]),
        returnType
      );
    }
  );
};
