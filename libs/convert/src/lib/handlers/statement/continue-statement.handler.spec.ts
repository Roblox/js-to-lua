import { continueStatement as babelContinueStatement } from '@babel/types';
import { continueStatement } from '@js-to-lua/lua-types';
import { createContinueStatementHandler } from './continue-statement.handler';

describe('Continue Statement Handler', () => {
  const continueStatementHandler = createContinueStatementHandler().handler;
  const source = '';

  it(`should handle continue statement`, () => {
    const given = babelContinueStatement();
    const expected = continueStatement();

    expect(continueStatementHandler(source, {}, given)).toEqual(expected);
  });
});
