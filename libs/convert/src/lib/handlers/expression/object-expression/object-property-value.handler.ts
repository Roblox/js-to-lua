import * as Babel from '@babel/types';
import { BaseNodeHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { combineExpressionsHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../identifier-handler-types';
import { createObjectValueFunctionExpressionHandler } from './object-value-function-expression.handler';

export const createObjectPropertyValueHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Babel.Expression>,
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
  const handleObjectValueFunctionExpression =
    createObjectValueFunctionExpressionHandler(
      handleStatement,
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );

  return combineExpressionsHandlers<
    LuaExpression,
    Babel.Expression | Babel.PatternLike
  >([handleObjectValueFunctionExpression, expressionHandler]).handler;
};
