import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras, WithExtras } from './extras';

export type NeedsPackagesExtra = { needsPackages: true };

export const withNeedsPackagesExtra = <N extends LuaNode>(
  node: N
): WithExtras<N, NeedsPackagesExtra> =>
  withExtras<NeedsPackagesExtra, N>({ needsPackages: true })(node);

export const hasNeedsPackagesExtra = <N extends LuaNode>(
  node: N
): node is WithExtras<N, NeedsPackagesExtra> =>
  node.extras?.needsPackages === true;
