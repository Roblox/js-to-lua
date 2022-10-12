import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
  EmptyConfig,
} from '@js-to-lua/handler-utils';
import {
  jsNumberName,
  JsNumberProperty,
  luaMathProperty,
  LuaNumberPolyfill,
  luaNumberPolyfill,
  luaNumberPolyfillName,
  NumberConst,
  numberConstIdentifier,
  PolyfillID,
  withNumberConstExtra,
  withPolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { LuaExpression, unaryExpression } from '@js-to-lua/lua-types';
import { HandlerMap } from '../../special-cases-helpers/handler-map';
import { isJSNumberProperty } from '../../special-cases-helpers/is-number-method';

const toNumberConst = (name: NumberConst) =>
  createHandlerFunction<LuaExpression, Babel.MemberExpression>(
    () =>
      withNumberConstExtra<LuaExpression>(name)(numberConstIdentifier(name)),
    { skipComments: true }
  );

const toNumberProperty = (propertyName: LuaNumberPolyfill) =>
  createHandlerFunction<LuaExpression, Babel.CallExpression>(
    () =>
      withPolyfillExtra<LuaExpression, PolyfillID>(luaNumberPolyfillName)(
        luaNumberPolyfill(propertyName)
      ),
    { skipComments: true }
  );

const toMissingNumberProperty = (propertyName: string) =>
  createHandlerFunction<LuaExpression, Babel.CallExpression>(
    () =>
      withTrailingConversionComment(
        withPolyfillExtra<LuaExpression, PolyfillID>(luaNumberPolyfillName)(
          luaNumberPolyfill(propertyName)
        ),
        `ROBLOX NOTE: Number.${propertyName} is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same`
      ),
    { skipComments: true }
  );

const luaNumberStaticPropertyMap: HandlerMap<
  LuaExpression,
  Babel.MemberExpression,
  EmptyConfig,
  JsNumberProperty
> = {
  isFinite: toNumberProperty('isFinite'),
  isInteger: toNumberProperty('isInteger'),
  isNaN: toNumberProperty('isNaN'),
  isSafeInteger: toNumberProperty('isSafeInteger'),
  parseFloat: toMissingNumberProperty('parseFloat'),
  parseInt: toMissingNumberProperty('parseInt'),
  MAX_VALUE: toNumberConst('MAX_VALUE'),
  MIN_VALUE: toNumberConst('MIN_VALUE'),
  NaN: toNumberProperty('NaN'),
  NEGATIVE_INFINITY: createHandlerFunction(
    () => unaryExpression('-', luaMathProperty('huge')),
    { skipComments: true }
  ),
  POSITIVE_INFINITY: createHandlerFunction(() => luaMathProperty('huge'), {
    skipComments: true,
  }),
  MAX_SAFE_INTEGER: toNumberProperty('MAX_SAFE_INTEGER'),
  MIN_SAFE_INTEGER: toNumberProperty('MIN_SAFE_INTEGER'),
  EPSILON: toNumberConst('EPSILON'),
};

export const createMemberExpressionKnownNumberPropertyHandlerFunction = () => {
  return createOptionalHandlerFunction<LuaExpression, Babel.MemberExpression>(
    (source, config, expression) => {
      const objectName = Babel.isIdentifier(expression.object)
        ? expression.object.name
        : undefined;
      const propertyName = Babel.isIdentifier(expression.property)
        ? expression.property.name
        : Babel.isStringLiteral(expression.property)
        ? expression.property.value
        : undefined;

      if (
        objectName !== jsNumberName ||
        !propertyName ||
        !isJSNumberProperty(propertyName)
      ) {
        return;
      }

      return luaNumberStaticPropertyMap[propertyName](
        source,
        config,
        expression
      );
    }
  );
};
