import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';
import {
  Expression,
  TaggedTemplateExpression,
  TemplateLiteral,
} from '@babel/types';
import { defaultExpressionHandler } from '../../utils/default-handlers';

export const createTaggedTemplateExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  templateLiteralHandlerFunction: HandlerFunction<
    LuaMultilineStringLiteral | LuaStringLiteral | LuaCallExpression,
    TemplateLiteral
  >
) =>
  createHandler<LuaExpression, TaggedTemplateExpression>(
    'TaggedTemplateExpression',
    (source, config, node) => {
      if (!node.quasi.expressions.length) {
        return callExpression(
          expressionHandlerFunction(source, config, node.tag),
          [templateLiteralHandlerFunction(source, config, node.quasi)]
        );
      }
      return defaultExpressionHandler(source, config, node);
    }
  );
