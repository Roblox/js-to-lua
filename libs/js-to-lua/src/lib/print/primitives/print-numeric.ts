import { LuaNumericLiteral } from '@js-to-lua/lua-types';

export const printNumeric = (node: LuaNumericLiteral): string =>
  node.extra?.raw || node.value.toString();
