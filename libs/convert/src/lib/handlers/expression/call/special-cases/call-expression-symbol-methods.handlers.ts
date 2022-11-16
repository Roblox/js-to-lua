import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { PolyfillID, withPolyfillExtra } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { HandlerMap } from '../../special-cases-helpers/handler-map';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { createCallExpressionDefaultHandler } from '../call-expression-default.handler';

const isSymbolIdentifier = (
  expression: Babel.Node
): expression is Babel.Identifier & { name: 'Symbol' } =>
  Babel.isIdentifier(expression) && expression.name === 'Symbol';

const symbolMethods = ['for'] as const;

type SymbolMethod = typeof symbolMethods[number];

const isSymbolMethod = (name: string): name is SymbolMethod =>
  (symbolMethods as ReadonlyArray<string>).includes(name);

export const createCallExpressionSymbolMethodsHandlers = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const argumentsHandler =
    createCallExpressionArgumentsHandler(handleExpression);
  const symbolMethodsHandlers: HandlerMap<
    LuaExpression,
    Babel.CallExpression,
    EmptyConfig,
    SymbolMethod
  > = {
    for: createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        callExpression(
          memberExpression(identifier('Symbol'), '.', identifier('for_')),
          argumentsHandler(source, config, node.arguments)
        )
    ),
  };
  return createOptionalHandlerFunction<LuaExpression, Babel.CallExpression>(
    (source, config, expression) => {
      const withSymbolPolyfillExtra = withPolyfillExtra<
        LuaExpression,
        PolyfillID
      >('Symbol');
      if (isSymbolIdentifier(expression.callee)) {
        const handleCallExpression =
          createCallExpressionDefaultHandler(handleExpression);

        const symbolCall = handleCallExpression(source, config, expression);
        return withSymbolPolyfillExtra(symbolCall);
      }
      if (
        Babel.isMemberExpression(expression.callee) &&
        isSymbolIdentifier(expression.callee.object)
      ) {
        if (
          (!expression.callee.computed &&
            Babel.isIdentifier(expression.callee.property) &&
            isSymbolMethod(expression.callee.property.name)) ||
          (expression.callee.computed &&
            Babel.isStringLiteral(expression.callee.property) &&
            isSymbolMethod(expression.callee.property.value))
        ) {
          const methodName = (
            Babel.isIdentifier(expression.callee.property)
              ? expression.callee.property.name
              : expression.callee.property.value
          ) as SymbolMethod;

          const symbolMethodCall = symbolMethodsHandlers[methodName](
            source,
            config,
            expression
          );
          return withSymbolPolyfillExtra(symbolMethodCall);
        }

        return withSymbolPolyfillExtra(
          callExpression(
            handleExpression(source, config, expression.callee),
            argumentsHandler(source, config, expression.arguments)
          )
        );
      }
    }
  );
};
