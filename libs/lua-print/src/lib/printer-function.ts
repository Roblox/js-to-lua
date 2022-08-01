import { LuaNode } from '@js-to-lua/lua-types';
import { PrintableNode } from '@js-to-lua/shared-utils';

export type PrinterFunction<N extends LuaNode> = (
  node: N
) => string | PrintableNode;
