import { identifier, typeQuery } from '@js-to-lua/lua-types';
import { createPrintTypeQuery } from './print-type-query';

describe('Print type query', () => {
  const printTypeOptional = createPrintTypeQuery((node) => node.type);
  it(`should type query of identifier`, () => {
    const given = typeQuery(identifier('foo'));
    expect(printTypeOptional(given)).toEqual(`typeof(Identifier)`);
  });
});
