import { bigIntLiteral } from '@babel/types';
import { numericLiteral } from '@js-to-lua/lua-types';
import { handleBigIntLiteral } from './big-int.handler';

const source = '';

describe('BigInt Handler', () => {
  it(`should return Lua BigIny Node`, () => {
    const given = bigIntLiteral('9007199254740991n');
    const expected = numericLiteral(9007199254740991, '9007199254740991n');

    expect(handleBigIntLiteral.handler(source, {}, given)).toEqual(expected);
  });
});
