import {
  AssignmentPattern,
  Declaration,
  Expression,
  FlowType,
  FunctionExpression,
  LVal,
  Noop,
  Statement,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  functionExpression,
  LuaDeclaration,
  LuaFunctionExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import {
  AssignedToConfig,
  removeAssignedToConfig,
} from '../../config/assigned-to.config';
import { removeNoShadowIdentifierConfig } from '../../config/no-shadow-identifiers.config';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createFunctionBodyHandler } from './function-body.handler';
import { IdentifierHandlerFunction } from './identifier-handler-types';

export const createFunctionExpressionHandler = (
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleIdentifier: IdentifierHandlerFunction,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) => {
  return createHandler<
    LuaFunctionExpression,
    FunctionExpression,
    AssignedToConfig
  >('FunctionExpression', (source, config, node) => {
    const functionParamsHandler = createFunctionParamsHandler(
      handleIdentifier,
      handleTypeAnnotation,
      handleType
    );

    const bodyConfig = pipe(
      removeAssignedToConfig,
      removeNoShadowIdentifierConfig
    )(config);

    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, bodyConfig);
    const handleParamsBody = createFunctionParamsBodyHandler(
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal
    );

    return functionExpression(
      functionParamsHandler(source, config, node),
      nodeGroup([
        ...handleParamsBody(source, bodyConfig, node),
        ...handleFunctionBody(node),
      ]),
      node.returnType
        ? handleTypeAnnotation(source, config, node.returnType)
        : undefined
    );
  });
};
