import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';
import { NeedsPackagesExtra } from './with-needs-packages-extra';

export type PolyfillID =
  | 'Array'
  | 'Boolean'
  | 'instanceof'
  | 'Map'
  | 'Math'
  | 'Number'
  | 'Object'
  | 'Set'
  | 'String'
  | 'Symbol'
  | 'WeakMap'
  | 'clearInterval'
  | 'setInterval'
  | 'clearTimeout'
  | 'console'
  | 'setTimeout';

export const isPolyfillID = (
  id: string,
  validPolyfills: PolyfillID[]
): id is PolyfillID => validPolyfills.includes(id as PolyfillID);

type PolyfillName<S extends string> = `polyfill.${S}`;

type PolyfillExtra<S extends string> = {
  [Property in PolyfillName<S>]: true;
} & NeedsPackagesExtra;

const polyfillExtra = <P extends PolyfillID>(p: P): PolyfillExtra<P> =>
  ({
    needsPackages: true,
    [`polyfill.${p}`]: true,
  } as PolyfillExtra<P>);

export const withPolyfillExtra = <N extends LuaNode, P extends PolyfillID>(
  polyfillIdentifier: P
) => withExtras<PolyfillExtra<P>, N>(polyfillExtra(polyfillIdentifier));

export const hasPolyfillExtra = (
  polyfillIdentifier: PolyfillID,
  node: LuaNode
) => node.extras?.[`polyfill.${polyfillIdentifier}`] === true;
