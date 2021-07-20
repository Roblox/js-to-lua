import { createHandler, HandlerFunction } from '../../types';
import { Expression, TemplateLiteral } from '@babel/types';
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

export const createMultilineStringLiteralHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandler<
    LuaMultilineStringLiteral | LuaStringLiteral | LuaCallExpression,
    TemplateLiteral
  >('TemplateLiteral', (source, config, literal) => {
    const handleExpression = expressionHandlerFunction(source, config);

    return literal.expressions.length
      ? callExpression(
          memberExpression(getLiteral(literal), ':', identifier('format')),
          literal.expressions.map(handleExpression)
        )
      : getLiteral(literal);
  });
};

function getLiteral(literal: TemplateLiteral) {
  return containsNewLine(literal)
    ? multilineStringLiteral(getMultilineString(literal))
    : stringLiteral(getString(literal));
}

function getString(literal: TemplateLiteral) {
  return literal.quasis.map((q) => q.value.cooked || q.value.raw).join('%s');
}

const getMultilineString = (literal: TemplateLiteral) => {
  const multilineString = getString(literal);
  return `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
};

const containsNewLine = (literal: TemplateLiteral): boolean => {
  return literal.quasis
    .map((element) => element.value.raw)
    .some((element) => /\n/.test(element));
};
