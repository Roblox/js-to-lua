import {
  ArrowFunctionExpression,
  AssignmentPattern,
  Declaration,
  Expression,
  FlowType,
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
import { extractWithComments } from '@js-to-lua/lua-conversion-utils';
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
import {
  noShadowIdentifiersConfig,
  removeNoShadowIdentifierConfig,
} from '../../config/no-shadow-identifiers.config';
import { createFunctionParamsWithBodyHandler } from '../function-params-with-body.handler';
import { createFunctionBodyHandler } from './function-body.handler';
import { IdentifierHandlerFunction } from './identifier-handler-types';

export const createArrowExpressionHandler = (
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
    ArrowFunctionExpression,
    AssignedToConfig
  >('ArrowFunctionExpression', (source, config, node) => {
    const bodyConfig = pipe(
      removeAssignedToConfig,
      removeNoShadowIdentifierConfig
    )(config);

    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, bodyConfig);
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
      noShadowIdentifiersConfig('self')(config),
      node
    );
    const returnType = node.returnType
      ? extractWithComments(
          handleTypeAnnotation(source, config, node.returnType),
          (base) => base.typeAnnotation
        )
      : undefined;

    return functionExpression(
      functionParams,
      nodeGroup([...paramsBody, ...handleFunctionBody(node)]),
      returnType
    );
  });
};
