import {
  jsMathProperties,
  LuaMathPolyfill,
  mathPolyfills,
} from '@js-to-lua/lua-conversion-utils';

export const isLuaMathPolyfill = (
  propertyName: string
): propertyName is LuaMathPolyfill =>
  mathPolyfills.includes(propertyName as LuaMathPolyfill);

export const isJSMathProperty = (propertyName: string) =>
  jsMathProperties.includes(propertyName);
