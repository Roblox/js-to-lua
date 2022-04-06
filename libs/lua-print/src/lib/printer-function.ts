import { LuaNode } from '@js-to-lua/lua-types';

export type PrinterFunction<N extends LuaNode> = (node: N) => string;
