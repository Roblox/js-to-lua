import {
  identifier,
  LuaMemberExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export const numberPolyfills = [
  'isFinite',
  'isInteger',
  'isNaN',
  'isSafeInteger',
  'NaN',
  'MAX_SAFE_INTEGER',
  'MIN_SAFE_INTEGER',
] as const;
export type LuaNumberPolyfill = typeof numberPolyfills[number];

export const jsNumberProperties = [
  'isFinite',
  'isInteger',
  'isNaN',
  'isSafeInteger',
  'parseFloat',
  'parseInt',
  'MAX_VALUE',
  'MIN_VALUE',
  'NaN',
  'NEGATIVE_INFINITY',
  'POSITIVE_INFINITY',
  'MAX_SAFE_INTEGER',
  'MIN_SAFE_INTEGER',
  'EPSILON',
] as const;

export type JsNumberProperty = typeof jsNumberProperties[number];

export const luaNumberPolyfillName = 'Number';
export const jsNumberName = 'Number';

export const luaNumberPolyfill = (methodName: string): LuaMemberExpression =>
  memberExpression(
    identifier(luaNumberPolyfillName),
    '.',
    identifier(methodName)
  );
