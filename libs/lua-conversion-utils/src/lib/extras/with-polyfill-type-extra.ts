import { LuaNode } from '@js-to-lua/lua-types';
import { hasOwnProperty, isTruthy } from '@js-to-lua/shared-utils';
import { withExtras } from './extras';
import { NeedsPackagesExtra } from './with-needs-packages-extra';

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

const requiresTsTypePolyfillMap: {
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

export const requiresTsTypePolyfill = (
  Object.keys(requiresTsTypePolyfillMap) as Array<PolyfillTypeID>
).map((key) => requiresTsTypePolyfillMap[key]);

export const requiresFlowTypePolyfillMap: {
  [P in PolyfillTypeID]:
    | {
        name: P;
        generics?: string[];
      }
    | undefined;
} = {
  Array: { name: 'Array', generics: ['T'] },
  Error: { name: 'Error' },
  Map: { name: 'Map', generics: ['T', 'U'] },
  Object: { name: 'Object' },
  Promise: { name: 'Promise', generics: ['T'] },
  PromiseLike: undefined,
  Set: { name: 'Set', generics: ['T'] },
  WeakMap: { name: 'WeakMap', generics: ['T', 'U'] },
};

export const requiresFlowTypePolyfill = (
  Object.keys(requiresFlowTypePolyfillMap) as Array<PolyfillTypeID>
)
  .map((key) => requiresFlowTypePolyfillMap[key])
  .filter(isTruthy);

type PolyfillTypeName<S extends PolyfillTypeID> = `polyfillType.${S}`;

type PolyfillTypeExtra<S extends PolyfillTypeID> = {
  [Property in PolyfillTypeName<S>]: true;
} & NeedsPackagesExtra;

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
