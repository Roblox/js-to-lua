import {
  createHandler,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaType,
  typeCastExpression,
  TypeCastExpression,
} from '@js-to-lua/lua-types';
import {
  Expression,
  TypeCastExpression as BabelTypeCastExpression,
  FlowType,
} from '@babel/types';

export const createFlowTypeCastExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeHandlerFunction: HandlerFunction<LuaType, FlowType>
) =>
  createHandler<TypeCastExpression, BabelTypeCastExpression>(
    'TypeCastExpression',
    (source, config, node) =>
      typeCastExpression(
        expressionHandlerFunction(source, config, node.expression),
        handleComments(
          source,
          node.typeAnnotation,
          typeHandlerFunction(
            source,
            config,
            node.typeAnnotation.typeAnnotation
          ),
          true
        )
      )
  );
