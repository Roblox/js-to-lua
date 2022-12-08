import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras, WithExtras } from './extras';
import { NeedsPackagesExtra } from './with-needs-packages-extra';

export type NeedsRegExpExtra = { needsRegExp: true } & NeedsPackagesExtra;

export const withNeedsRegExpExtra = <N extends LuaNode>(
  node: N
): WithExtras<N, NeedsRegExpExtra> =>
  withExtras<NeedsRegExpExtra, N>({ needsRegExp: true, needsPackages: true })(
    node
  );

export const hasNeedsRegExpExtra = <N extends LuaNode>(
  node: N
): node is WithExtras<N, NeedsRegExpExtra> => node.extras?.needsRegExp === true;
