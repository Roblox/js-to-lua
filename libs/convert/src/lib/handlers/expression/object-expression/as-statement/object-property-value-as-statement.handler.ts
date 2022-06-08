import * as Babel from '@babel/types';
import {
  BaseNodeAsStatementHandler,
  combineAsStatementHandlers,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultExpressionAsStatementHandler } from '@js-to-lua/lua-conversion-utils';
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
import { IdentifierHandlerFunction } from '../../identifier-handler-types';
import { createObjectValueFunctionExpressionAsStatementHandler } from './object-value-function-as-statement.handler';

export const createObjectPropertyValueAsStatementHandler = (
  expressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaStatement,
    Babel.Expression
  >,
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
    createObjectValueFunctionExpressionAsStatementHandler(
      handleStatement,
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );

  return combineAsStatementHandlers<
    LuaStatement,
    Babel.Expression | Babel.PatternLike,
    LuaExpression
  >(
    [handleObjectValueFunctionExpression, expressionAsStatementHandler],
    defaultExpressionAsStatementHandler
  ).handler;
};
