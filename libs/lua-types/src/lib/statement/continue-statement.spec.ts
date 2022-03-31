import { continueStatement, isContinueStatement } from './continue-statement';
import { isStatement } from './statement';

describe('ContinueStatement Type', () => {
  it('should return true for isContinueStatement', () => {
    expect(isContinueStatement(continueStatement())).toEqual(true);
  });
  it('should return true for isStatement', () => {
    expect(isStatement(continueStatement())).toEqual(true);
  });
});
