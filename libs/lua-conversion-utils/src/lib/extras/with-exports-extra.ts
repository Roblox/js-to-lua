import { LuaNode } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type DoesExportExtra = {
  doesExport: true;
};

export type WithDoesExportExtra<N extends LuaNode> = N &
  WithExtras<N, DoesExportExtra>;

export const withExportsExtras = <N extends LuaNode>(node: N) =>
  withExtras<DoesExportExtra, N>({
    doesExport: true,
  })(node);

export const isWithExportsExtras = <N extends LuaNode>(
  node: N
): node is WithDoesExportExtra<N> => node.extras?.doesExport === true;

isWithExportsExtras.not = <N extends LuaNode>(
  node: N
): node is Exclude<N, WithDoesExportExtra<N>> => !isWithExportsExtras(node);
