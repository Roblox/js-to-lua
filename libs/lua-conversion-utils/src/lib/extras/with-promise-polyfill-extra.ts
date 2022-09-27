import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras, WithExtras } from './extras';
import { NeedsPackagesExtra } from './with-needs-packages-extra';

export type NeedsPromiseExtra = { needsPromise: true } & NeedsPackagesExtra;

export const withNeedsPromiseExtra = <N extends LuaNode>(
  node: N
): WithExtras<N, NeedsPromiseExtra> =>
  withExtras<NeedsPromiseExtra, N>({ needsPromise: true, needsPackages: true })(
    node
  );

export const hasNeedsPromiseExtra = <N extends LuaNode>(
  node: N
): node is WithExtras<N, NeedsPromiseExtra> =>
  node.extras?.needsPromise === true;
