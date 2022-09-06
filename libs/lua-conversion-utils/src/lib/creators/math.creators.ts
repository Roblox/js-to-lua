import {
  identifier,
  LuaIdentifier,
  LuaMemberExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export const luaMathStaticProperties = ['huge', 'pi'] as const;
export type LuaMathStaticPropertyName = typeof luaMathStaticProperties[number];
export const luaMathMethods = [
  'abs',
  'acos',
  'asin',
  'atan',
  'atan2',
  'ceil',
  'cos',
  'cosh',
  'deg',
  'exp',
  'floor',
  'fmod',
  'frexp',
  'idexp',
  'log',
  'log10',
  'max',
  'min',
  'modf',
  'pow',
  'rad',
  'random',
  'randomseed',
  'sin',
  'sign',
  'sinh',
  'sqrt',
  'tan',
  'tanh',
] as const;
export type LuaMathMethodName = typeof luaMathMethods[number];

export const mathPolyfills = ['clz32'] as const;
export type LuaMathPolyfill = typeof mathPolyfills[number];

export const jsMathProperties = Object.getOwnPropertyNames(Math);

export const luaMathPolyfillName = 'Math';
export const luaMathIdentifer = (): LuaIdentifier => identifier('math');

export const luaMathProperty = (
  propertyName: LuaMathMethodName | LuaMathStaticPropertyName
): LuaMemberExpression =>
  memberExpression(luaMathIdentifer(), '.', identifier(propertyName));

export const luaMathPolyfill = (methodName: string): LuaMemberExpression =>
  memberExpression(
    identifier(luaMathPolyfillName),
    '.',
    identifier(methodName)
  );
