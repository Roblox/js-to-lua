import { breakStatement as babelBreakStatement } from '@babel/types';
import { breakStatement } from '@js-to-lua/lua-types';
import { createBreakStatementHandler } from './break-statement.handler';

describe('Break Statement Handler', () => {
  const breakStatementHandler = createBreakStatementHandler();
  const source = '';

  it(`should handle break statement`, () => {
    const given = babelBreakStatement();
    const expected = breakStatement();

    expect(breakStatementHandler.handler(source, {}, given)).toEqual(expected);
  });
});
