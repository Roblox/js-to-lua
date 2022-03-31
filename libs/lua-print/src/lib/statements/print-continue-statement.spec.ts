import { continueStatement } from '@js-to-lua/lua-types';
import { createPrintContinueStatement } from './print-continue-statement';

describe('Print Continue Statement', () => {
  const printContinueStatement = createPrintContinueStatement();
  it('should print Continue Statement', () => {
    const given = continueStatement();
    const expected = 'continue';

    expect(printContinueStatement(given)).toEqual(expected);
  });
});
