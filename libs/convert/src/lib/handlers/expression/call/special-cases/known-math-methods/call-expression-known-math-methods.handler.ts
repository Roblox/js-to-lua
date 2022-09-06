import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  withTrailingConversionComment,
  luaMathPolyfill,
  withPolyfillExtra,
  PolyfillID,
  luaMathPolyfillName,
  bit32Identifier,
  LuaMathMethodName,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { HandlerMap } from '../../../special-cases-helpers/handler-map';

import {
  isJSMathProperty,
  isLuaMathPolyfill,
} from '../../../special-cases-helpers/is-math-method';
import { createCallExpressionArgumentsHandler } from '../../call-expression-arguments.handler';
export const createCallExpressionKnownMathMethodHandlerFunction = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const argumentsHandler = createCallExpressionArgumentsHandler(
    handleExpressionFunction
  );
  const toMathCall = (methodName: LuaMathMethodName) =>
    createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        callExpression(
          memberExpression(identifier('math'), '.', identifier(methodName)),
          argumentsHandler(source, config, node.arguments)
        )
    );

  const luaMathMethodMap: HandlerMap<LuaExpression, Babel.CallExpression> = {
    abs: toMathCall('abs'),
    acos: toMathCall('acos'),
    asin: toMathCall('asin'),
    atan: toMathCall('atan'),
    atan2: toMathCall('atan2'),
    ceil: toMathCall('ceil'),
    cos: toMathCall('cos'),
    cosh: toMathCall('cosh'),
    exp: toMathCall('exp'),
    floor: toMathCall('floor'),
    log: toMathCall('log'),
    log10: toMathCall('log10'),
    max: toMathCall('max'),
    min: toMathCall('min'),
    pow: toMathCall('pow'),
    random: toMathCall('random'),
    sign: toMathCall('sign'),
    sin: toMathCall('sin'),
    sinh: toMathCall('sinh'),
    sqrt: toMathCall('sqrt'),
    tan: toMathCall('tan'),
    tanh: toMathCall('tanh'),
    clz32: createHandlerFunction<LuaExpression, Babel.CallExpression>(
      (source, config, node) =>
        callExpression(
          memberExpression(bit32Identifier(), '.', identifier('countlz')),
          argumentsHandler(source, config, node.arguments)
        )
    ),
  };

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

      if (objectName !== 'Math' || !propertyName) {
        return;
      }

      const args = argumentsHandler(source, config, expression.arguments);

      if (luaMathMethodMap[propertyName]) {
        return luaMathMethodMap[propertyName](source, config, expression);
      }

      const polyfillMathExpression = withPolyfillExtra<
        LuaCallExpression,
        PolyfillID
      >(luaMathPolyfillName)(
        callExpression(luaMathPolyfill(propertyName), args)
      );

      return isLuaMathPolyfill(propertyName)
        ? polyfillMathExpression
        : isJSMathProperty(propertyName)
        ? withTrailingConversionComment(
            polyfillMathExpression,
            `ROBLOX NOTE: Math.${propertyName} is currently not supported by the lua Math polyfill, please add your own implementation or file a ticket on the same`
          )
        : undefined;
    }
  );
};
