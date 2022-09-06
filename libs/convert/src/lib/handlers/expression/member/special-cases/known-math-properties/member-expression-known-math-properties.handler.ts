import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  withTrailingConversionComment,
  luaMathPolyfill,
  withPolyfillExtra,
  PolyfillID,
  luaMathPolyfillName,
  withMathExtra,
  MathConst,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaMemberExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { HandlerMap } from '../../../special-cases-helpers/handler-map';

import {
  isJSMathProperty,
  isLuaMathPolyfill,
} from '../../../special-cases-helpers/is-math-method';

const toMathConst = (mathConst: MathConst) =>
  createHandlerFunction<LuaExpression, Babel.MemberExpression>(
    () =>
      withMathExtra<LuaExpression>(mathConst)(identifier(`Math_${mathConst}`)),
    { skipComments: true }
  );

const luaMathStaticPropertyMap: HandlerMap<
  LuaExpression,
  Babel.MemberExpression
> = {
  E: toMathConst('E'),
  LN2: toMathConst('LN2'),
  LN10: toMathConst('LN10'),
  LOG2E: toMathConst('LOG2E'),
  LOG10E: toMathConst('LOG10E'),
  PI: createHandlerFunction(
    () => memberExpression(identifier('math'), '.', identifier('pi')),
    { skipComments: true }
  ),
  SQRT1_2: toMathConst('SQRT1_2'),
  SQRT2: toMathConst('SQRT2'),
};

export const createMemberExpressionKnownMathPropertyHandlerFunction = () => {
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

      if (objectName !== 'Math' || !propertyName) return;

      if (luaMathStaticPropertyMap[propertyName]) {
        const mathProperty = luaMathStaticPropertyMap[propertyName];
        return mathProperty(source, config, expression);
      }

      const polyfillMathExpression = withPolyfillExtra<
        LuaMemberExpression,
        PolyfillID
      >(luaMathPolyfillName)(luaMathPolyfill(propertyName));

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
