import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultExpressionHandler,
  isStringInferable,
  joinExpressionsWith,
  stringInferableExpression,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { splitStringBy } from './split-string-by';

export const createTemplateLiteralHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<LuaExpression, Babel.TemplateLiteral>(
    'TemplateLiteral',
    (source, config, literal) => {
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
              memberExpression(
                getLiteral(literal.quasis, true),
                ':',
                identifier('format')
              ),
              literal.expressions.map(handleLiteralExpression)
            )
          )
        : getLiteral(literal.quasis);
    }
  );
};

const getLiteral = (
  templateElements: Babel.TemplateElement[],
  prepareForStringFormat = false
) =>
  containsNewLine(templateElements)
    ? handleMultilineStringLiteral(templateElements, prepareForStringFormat)
    : stringLiteral(getString(templateElements, prepareForStringFormat));

const handleMultilineStringLiteral = (
  templateElements: Babel.TemplateElement[],
  prepareForStringFormat: boolean
): LuaExpression => {
  return templateElements
    .map(templateElementToString(prepareForStringFormat))
    .map(splitStringByEscapeChars)
    .map(concatenateMultilineStrings)
    .reduce(joinExpressionsWith('%s'));
};

const splitStringByEscapeChars = splitStringBy(
  /(?<prevBackspaces>(\\{2})*)\\(?<escapedChar>[bfnrtv0\\])/g
);

const getString = (
  templateElements: Babel.TemplateElement[],
  prepareForStringFormat: boolean
) =>
  templateElements
    .map(templateElementToString(prepareForStringFormat))
    .join('%s');

const templateElementToString =
  (prepareForStringFormat: boolean) =>
  (templateElement: Babel.TemplateElement): string => {
    const simplified = simplifyUnnecessaryEscapedChars(
      templateElement.value.raw
    );
    return prepareForStringFormat ? simplified.replace(/%/g, '%%') : simplified;
  };

const getMultilineString = (multilineString: string) => {
  const result = `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
  return simplifyUnnecessaryEscapedChars(result);
};

const concatenateMultilineStrings = (
  groupedString: Array<string | string[]>
): LuaExpression =>
  groupedString
    .map(
      (stringOrGroup): LuaExpression =>
        typeof stringOrGroup === 'string'
          ? multilineStringLiteral(getMultilineString(stringOrGroup))
          : stringLiteral(stringOrGroup.join(''))
    )
    .reduce((left, right) => binaryExpression(left, '..', right));

const containsNewLine = (templateElements: Babel.TemplateElement[]): boolean =>
  templateElements
    .map((element) => element.value.raw)
    .some((element) => /\n/.test(element));

const simplifyUnnecessaryEscapedChars = (str: string): string =>
  str
    .replace(/(\\*)\\(\w)/g, (match, prevBackspaces, escapedChar) => {
      if (prevBackspaces.length % 2 != 0 || /[bfnrtv0]/.test(escapedChar)) {
        return match;
      }
      return escapedChar;
    })
    .replace(/\\(['"`])/g, '$1');
