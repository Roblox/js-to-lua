import { identifier, LuaNode, typeofExpression } from '@js-to-lua/lua-types';
import { createPrintTypeOfExpression } from './print-typeof-expression';

describe('Print typeof expression', () => {
  const printTypeOfExpression = createPrintTypeOfExpression(
    jest.fn().mockImplementation((node: LuaNode) => {
      return node.type;
    })
  );

  it('should print typeof expression with expression', () => {
    const given = typeofExpression(identifier('foo'));

    const expected = 'typeof(Identifier)';

    expect(printTypeOfExpression(given)).toEqual(expected);
  });
});
