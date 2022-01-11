import { LuaIdentifier, LuaNode, withExtras } from '@js-to-lua/lua-types';

export const requiresTypePolyfill = [
  { name: 'Array', generics: ['T'] },
  { name: 'Error' },
  { name: 'Map', generics: ['T', 'U'] },
  { name: 'Object' },
  { name: 'Promise', generics: ['T'] },
  { name: 'PromiseLike', generics: ['T'] },
  { name: 'Set', generics: ['T'] },
  { name: 'WeakMap', generics: ['T', 'U'] },
];

export const withPolyfillTypeExtra = (
  polyfillIdentifier: string,
  generics?: string[]
) =>
  withExtras({
    needsPackages: true,
    [`polyfillType.${polyfillIdentifier}`]: {
      name: polyfillIdentifier,
      ...(generics ? { generics } : {}),
    },
  });

export const hasPolyfillTypeExtra = (
  polyfillIdentifier: LuaIdentifier,
  node: LuaNode
) => node.extras?.sourceType === `polyfillType.${polyfillIdentifier}`;
