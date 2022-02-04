import {
  Expression,
  TaggedTemplateExpression,
  TemplateLiteral,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultExpressionHandler } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';

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
