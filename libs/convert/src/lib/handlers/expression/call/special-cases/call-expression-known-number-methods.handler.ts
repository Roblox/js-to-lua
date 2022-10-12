import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  jsNumberName,
  JsNumberProperty,
  luaNumberPolyfill,
  LuaNumberPolyfill,
  luaNumberPolyfillName,
  PolyfillID,
  withPolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { HandlerMap } from '../../special-cases-helpers/handler-map';
import { isJSNumberProperty } from '../../special-cases-helpers/is-number-method';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';

export const createCallExpressionKnownNumberMethodHandlerFunction = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const luaNumberMethodMap = createNumberMethodHandlerMap(
    handleExpressionFunction
  );
  return createOptionalHandlerFunction<LuaExpression, Babel.CallExpression>(
    (source, config, expression) => {
      const { callee } = expression;

      if (!Babel.isMemberExpression(callee)) {
        return;
      }

      const objectName = Babel.isIdentifier(callee.object)
        ? callee.object.name
        : undefined;
      const propertyName = Babel.isIdentifier(callee.property)
        ? callee.property.name
        : Babel.isStringLiteral(callee.property)
        ? callee.property.value
        : undefined;

      if (
        objectName !== jsNumberName ||
        !propertyName ||
        !isJSNumberProperty(propertyName)
      ) {
        return;
      }

      return luaNumberMethodMap[propertyName](source, config, expression);
    }
  );
};

const createNumberMethodHandlerMap = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Babel.Expression>
): HandlerMap<
  LuaExpression,
  Babel.CallExpression,
  EmptyConfig,
  JsNumberProperty
> => {
  const argumentsHandler = createCallExpressionArgumentsHandler(
    handleExpressionFunction
  );
  const toNumberCall = (methodName: LuaNumberPolyfill) =>
    createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        withPolyfillExtra<LuaCallExpression, PolyfillID>(luaNumberPolyfillName)(
          callExpression(
            luaNumberPolyfill(methodName),
            argumentsHandler(source, config, node.arguments)
          )
        ),
      { skipComments: true }
    );

  const toNumberMissingCall = (methodName: string) =>
    createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        withTrailingConversionComment(
          withPolyfillExtra<LuaCallExpression, PolyfillID>(
            luaNumberPolyfillName
          )(
            callExpression(
              luaNumberPolyfill(methodName),
              argumentsHandler(source, config, node.arguments)
            )
          ),
          `ROBLOX NOTE: Number.${methodName} is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same`
        ),
      { skipComments: true }
    );

  const toNumberInvalidCall = (propertyName: string) =>
    createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        withTrailingConversionComment(
          withPolyfillExtra<LuaCallExpression, PolyfillID>(
            luaNumberPolyfillName
          )(
            callExpression(
              luaNumberPolyfill(propertyName),
              argumentsHandler(source, config, node.arguments)
            )
          ),
          `ROBLOX CHECK: Number.${propertyName} is currently not a JS function. Please verify the conversion output`
        ),
      { skipComments: true }
    );

  return {
    isFinite: toNumberCall('isFinite'),
    isInteger: toNumberCall('isInteger'),
    isNaN: toNumberCall('isNaN'),
    isSafeInteger: toNumberCall('isSafeInteger'),
    parseFloat: toNumberMissingCall('parseFloat'),
    parseInt: toNumberMissingCall('parseInt'),
    MAX_VALUE: toNumberInvalidCall('MAX_VALUE'),
    MIN_VALUE: toNumberInvalidCall('MIN_VALUE'),
    NaN: toNumberInvalidCall('NaN'),
    NEGATIVE_INFINITY: toNumberInvalidCall('NEGATIVE_INFINITY'),
    POSITIVE_INFINITY: toNumberInvalidCall('POSITIVE_INFINITY'),
    MAX_SAFE_INTEGER: toNumberInvalidCall('MAX_SAFE_INTEGER'),
    MIN_SAFE_INTEGER: toNumberInvalidCall('MIN_SAFE_INTEGER'),
    EPSILON: toNumberInvalidCall('EPSILON'),
  };
};
