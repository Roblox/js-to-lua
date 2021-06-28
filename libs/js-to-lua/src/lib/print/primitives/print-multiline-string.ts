import { LuaMultilineStringLiteral } from '@js-to-lua/lua-types';
import { calculateEqualsForDelimiter } from '../utils';

export function printMultilineString(node: LuaMultilineStringLiteral) {
  const numberOfEquals = calculateEqualsForDelimiter(node.value);
  return `[${'='.repeat(numberOfEquals)}[${node.value}]${'='.repeat(
    numberOfEquals
  )}]`;
}
