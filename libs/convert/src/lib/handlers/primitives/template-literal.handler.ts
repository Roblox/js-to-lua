import * as Babel from '@babel/types';
import {
  defaultExpressionHandler,
  isStringInferable,
  stringInferableExpression,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaStringLiteral,
  memberExpression,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { pipe } from 'ramda';

export const createTemplateLiteralHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<
    LuaMultilineStringLiteral | LuaStringLiteral | LuaCallExpression,
    Babel.TemplateLiteral
  >('TemplateLiteral', (source, config, literal) => {
    const handleExpression = expressionHandlerFunction(source, config);
    const handleLiteralExpression = pipe(
      (node: Babel.Expression | Babel.TSType) =>
        Babel.isExpression(node)
          ? handleExpression(node)
          : defaultExpressionHandler(source, config, node),
      (expression) =>
        isStringInferable(expression)
          ? expression
          : callExpression(identifier('tostring'), [expression])
    );

    return literal.expressions.length
      ? stringInferableExpression(
          callExpression(
            memberExpression(getLiteral(literal), ':', identifier('format')),
            literal.expressions.map(handleLiteralExpression)
          )
        )
      : getLiteral(literal);
  });
};

function getLiteral(literal: Babel.TemplateLiteral) {
  return containsNewLine(literal)
    ? multilineStringLiteral(getMultilineString(literal))
    : stringLiteral(getString(literal));
}

function getString(literal: Babel.TemplateLiteral) {
  return literal.quasis.map((q) => q.value.cooked || q.value.raw).join('%s');
}

const getMultilineString = (literal: Babel.TemplateLiteral) => {
  const multilineString = getString(literal);
  return `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
};

const containsNewLine = (literal: Babel.TemplateLiteral): boolean => {
  return literal.quasis
    .map((element) => element.value.raw)
    .some((element) => /\n/.test(element));
};
