import { LuaStringLiteral } from '@js-to-lua/lua-types';

export const printString = (node: LuaStringLiteral): string => {
  if (node.extra?.raw) {
    return `${node.extra.raw}`;
  }

  const escapedString = node.value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  return Array.from(`"${escapedString}"`)
    .map((value) => {
      const codePoint = value.codePointAt(0);
      if (codePoint > 127) {
        const hex = codePoint.toString(16).toUpperCase();
        value = `\\u{${hex}}`;
      }
      return value;
    })
    .join('');
};
