import { createHandler, HandlerFunction } from '../../types';
import {
  LuaExpression,
  typeAny,
  typeCastExpression,
  TypeCastExpression,
} from '@js-to-lua/lua-types';
import {
  Expression,
  isTSNonNullExpression,
  TSNonNullExpression,
} from '@babel/types';

export const createTsNonNullExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<TypeCastExpression, TSNonNullExpression>(
    'TSNonNullExpression',
    (source, config, node) => {
      while (isTSNonNullExpression(node.expression)) {
        node = node.expression;
      }
      return typeCastExpression(
        expressionHandlerFunction(source, config, node.expression),
        typeAny()
      );
    }
  );
