import { LuaStringLiteral } from '../../lua-nodes.types';

export const printString = (node: LuaStringLiteral): string => {
  return Array
    .from(
      `"${node.value.replace(/"/g, '\\"')}"`)
    .map(value => {
      const codePoint = value.codePointAt(0);
      if (codePoint > 127) {
        const hex = codePoint.toString(16).toUpperCase();
        value = `\\u{${hex}}`;
      }
      return value;
    })
    .join('');
};
