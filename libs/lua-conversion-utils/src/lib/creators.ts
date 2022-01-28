import {
  identifier,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNode,
  memberExpression,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export type PolyfillID =
  | 'Array'
  | 'Boolean'
  | 'Map'
  | 'Number'
  | 'Object'
  | 'Set'
  | 'String'
  | 'Symbol'
  | 'WeakMap'
  | 'clearTimeout'
  | 'console'
  | 'setTimeout';

export const isPolyfillID = (
  id: string,
  validPolyfills: PolyfillID[]
): id is PolyfillID => validPolyfills.includes(id as PolyfillID);

export const withPolyfillExtra = (polyfillIdentifier: PolyfillID) =>
  withExtras({
    needsPackages: true,
    [`polyfill.${polyfillIdentifier}`]: true,
  });

export const hasPolyfillExtra = (
  polyfillIdentifier: PolyfillID,
  node: LuaNode
) => node.extras?.sourceType === `polyfill.${polyfillIdentifier}`;

type BooleanMethod = 'toJSBoolean';
export const booleanIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Boolean')(identifier('Boolean'));
export const booleanMethod = (methodName: BooleanMethod): LuaMemberExpression =>
  memberExpression(booleanIdentifier(), '.', identifier(methodName));

export const bit32Identifier = (): LuaIdentifier => identifier('bit32');

export const arrayPolyfilledMethodNames = [
  'concat',
  'every',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'from',
  'includes',
  'indexOf',
  'join',
  'map',
  'reduce',
  'reverse',
  // 'shift' is handled separately
  'slice',
  'some',
  'sort',
  'splice',
  // 'unshift' is handled separately
] as const;

export type ArrayPolyfilledMethodName =
  | typeof arrayPolyfilledMethodNames[number]
  | 'shift'
  | 'unshift';

export const promiseMethods = ['resolve'] as const;

export type PromiseMethodName = typeof promiseMethods[number];

export const promiseIdentifier = (): LuaIdentifier => identifier('Promise');
export const promiseMethod = (
  methodName: PromiseMethodName
): LuaMemberExpression =>
  memberExpression(promiseIdentifier(), '.', identifier(methodName));

export const arrayIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Array')(identifier('Array'));
export const arrayMethod = (
  methodName: ArrayPolyfilledMethodName
): LuaMemberExpression =>
  memberExpression(arrayIdentifier(), '.', identifier(methodName));
export const arrayConcat = (): LuaMemberExpression => arrayMethod('concat');
export const arraySpread = (): LuaMemberExpression =>
  memberExpression(arrayIdentifier(), '.', identifier('spread'));
export const arrayIndexOf = (): LuaMemberExpression => arrayMethod('indexOf');

export const objectIdentifier = (): LuaIdentifier =>
  withPolyfillExtra('Object')(identifier('Object'));
export const objectAssign = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('assign'));
export const objectKeys = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('keys'));

export const objectNone = (): LuaMemberExpression =>
  memberExpression(objectIdentifier(), '.', identifier('None'));

export const selfIdentifier = (): LuaIdentifier => identifier('self');
