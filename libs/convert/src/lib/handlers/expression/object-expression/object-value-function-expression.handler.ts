import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  functionExpression,
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
import { createFunctionParamsHandler } from '../../function-params.handler';
import { IdentifierHandlerFunction } from '../identifier-handler-types';
import { isBabelAssignmentPattern } from './babel-assignment-pattern';

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
      const functionParamsHandler = createFunctionParamsHandler(
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      );

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
          ...node.body.body.map<LuaStatement>(handleStatement(source, config)),
        ]),
        node.returnType
          ? handleTypeAnnotation(source, config, node.returnType)
          : undefined
      );
    }
  );
};
