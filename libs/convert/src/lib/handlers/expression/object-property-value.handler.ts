import {
  AssignmentPattern,
  Declaration,
  Expression,
  FlowType,
  FunctionExpression,
  isAssignmentPattern as isBabelAssignmentPattern_,
  LVal,
  Noop,
  PatternLike,
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
import { combineExpressionsHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  functionExpression,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { createFunctionParamsHandler } from '../function-params.handler';
import { IdentifierHandlerFunction } from './identifier-handler-types';

const isBabelAssignmentPattern = (param: unknown): param is AssignmentPattern =>
  isBabelAssignmentPattern_(param as any);

export const createObjectPropertyValueHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
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
  const handleObjectValueFunctionExpression: BaseNodeHandler<
    LuaFunctionExpression,
    FunctionExpression
  > = createHandler('FunctionExpression', (source, config, node) => {
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
  });

  return combineExpressionsHandlers<LuaExpression, Expression | PatternLike>([
    handleObjectValueFunctionExpression,
    expressionHandler,
  ]).handler;
};
