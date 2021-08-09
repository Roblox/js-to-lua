import { typeCastExpression } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '../../testUtils/mock-node';
import { createPrintTypeCastExpression } from './print-type-cast-expression';

describe('Print type cast expression', () => {
  it('should print type cast expression', () => {
    const printTypeCastExpression = createPrintTypeCastExpression(
      jest
        .fn()
        .mockImplementationOnce(() => 'expression')
        .mockImplementationOnce(() => 'typeAnnotation')
    );

    const given = typeCastExpression(
      mockNodeWithValue('expression'),
      mockNodeWithValue('typeAnnotation')
    );

    const expected = `expression :: typeAnnotation`;

    expect(printTypeCastExpression(given)).toEqual(expected);
  });
});
