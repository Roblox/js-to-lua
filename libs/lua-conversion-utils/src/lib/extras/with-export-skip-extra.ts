import { LuaNode } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type ExportSkipExtra = {
  exportSkip: true;
};

export type WithExportSkipExtra<N extends LuaNode> = N &
  WithExtras<N, ExportSkipExtra>;

export const withExportSkipExtras = <N extends LuaNode>(node: N) =>
  withExtras<ExportSkipExtra, N>({
    exportSkip: true,
  })(node);

export const isWithExportSkipExtras = <N extends LuaNode>(
  node: N
): node is WithExportSkipExtra<N> => node.extras?.exportSkip === true;
