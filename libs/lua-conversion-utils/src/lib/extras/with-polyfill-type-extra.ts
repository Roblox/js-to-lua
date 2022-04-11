import { LuaNode } from '@js-to-lua/lua-types';
import { hasOwnProperty } from '@js-to-lua/shared-utils';
import { withExtras } from './extras';

const polyfillTypeIds = [
  'Array',
  'Error',
  'Map',
  'Object',
  'Promise',
  'PromiseLike',
  'Set',
  'WeakMap',
] as const;

export type PolyfillTypeID = typeof polyfillTypeIds[number];

const requiresTypePolyfillMap: {
  [P in PolyfillTypeID]: {
    name: P;
    generics?: string[];
  };
} = {
  Array: { name: 'Array', generics: ['T'] },
  Error: { name: 'Error' },
  Map: { name: 'Map', generics: ['T', 'U'] },
  Object: { name: 'Object' },
  Promise: { name: 'Promise', generics: ['T'] },
  PromiseLike: { name: 'PromiseLike', generics: ['T'] },
  Set: { name: 'Set', generics: ['T'] },
  WeakMap: { name: 'WeakMap', generics: ['T', 'U'] },
};

export const requiresTypePolyfill = (
  Object.keys(requiresTypePolyfillMap) as Array<PolyfillTypeID>
).map((key) => requiresTypePolyfillMap[key]);

type PolyfillTypeName<S extends PolyfillTypeID> = `polyfillType.${S}`;

type PolyfillTypeExtra<S extends PolyfillTypeID> = {
  [Property in PolyfillTypeName<S>]: true;
} & {
  needsPackages: true;
};

const polyfillTypeExtra = <P extends PolyfillTypeID>(
  polyfillIdentifier: P,
  generics?: string[]
): PolyfillTypeExtra<P> =>
  ({
    needsPackages: true,
    [`polyfillType.${polyfillIdentifier}`]: {
      name: polyfillIdentifier,
      ...(generics ? { generics } : {}),
    },
  } as PolyfillTypeExtra<P>);

export const withPolyfillTypeExtra = <
  N extends LuaNode,
  P extends PolyfillTypeID
>(
  polyfillIdentifier: P,
  generics?: string[]
) =>
  withExtras<PolyfillTypeExtra<P>, N>(
    polyfillTypeExtra(polyfillIdentifier, generics)
  );

export const hasPolyfillTypeExtra = <P extends PolyfillTypeID>(
  polyfillIdentifier: P,
  node: LuaNode
) => {
  const extra = node.extras?.[`polyfillType.${polyfillIdentifier}`];
  return (
    extra !== null &&
    typeof extra === 'object' &&
    hasOwnProperty(extra, 'name') &&
    extra.name === polyfillIdentifier
  );
};
