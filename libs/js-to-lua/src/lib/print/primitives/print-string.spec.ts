import { LuaStringLiteral } from '../../lua-nodes.types';
import { printString } from './print-string';

describe('Print StringLiteral', () => {
  ['', 'abc', '1abc_@#$%'].forEach(value => {
    it(`should print a Lua String Node with value "${value}"`, () => {
      const literal: LuaStringLiteral = { type: 'StringLiteral', value };
      expect(printString(literal)).toEqual(`"${value}"`);
    });
  });

  [
    [`"quoted string"`, `"\\"quoted string\\""`],
    [`'quoted string'`, `"'quoted string'"`],
    [`[[quoted string]]`, `"[[quoted string]]"`]
  ].forEach(pair => {
    const [value, expected] = pair;

    it(`should escape double quote characters in ${value} when printing string literals`, () => {
      const literal: LuaStringLiteral = { type: 'StringLiteral', value };
      expect(printString(literal)).toEqual(expected);
    });
  });

  [
    [`😀`, `"\\u{1F600}"`],
    [`😤`, `"\\u{1F624}"`],
    [`💩`, `"\\u{1F4A9}"`],
    [`👧`, `"\\u{1F467}"`],
    [`👦`, `"\\u{1F466}"`]
  ].forEach(pair => {
    const [value, expected] = pair;

    it(`should escape unicode character ${value} when printing string literals`, () => {
      const literal: LuaStringLiteral = { type: 'StringLiteral', value };
      expect(printString(literal)).toEqual(expected);
    });
  });

  [
    [`👩‍⚕️`, `"\\u{1F469}\\u{200D}\\u{2695}\\u{FE0F}"`],
    [`🏳️‍⚧️`, `"\\u{1F3F3}\\u{FE0F}\\u{200D}\\u{26A7}\\u{FE0F}"`]
  ].forEach(pair => {
    const [value, expected] = pair;

    it(`should escape multi-character unicode sequence ${value} when printing string literals`, () => {
      const literal: LuaStringLiteral = { type: 'StringLiteral', value };
      expect(printString(literal)).toEqual(expected);
    });
  });
});
