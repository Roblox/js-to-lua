import { LuaNumericLiteral } from '../../lua-nodes.types';

export const printNumeric = (node: LuaNumericLiteral): string =>
  node.extra?.raw || node.value.toString();
