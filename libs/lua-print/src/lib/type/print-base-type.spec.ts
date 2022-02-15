import { createPrintBaseType } from './print-base-type';
import {
  identifier,
  typeAny,
  typeBoolean,
  typeLiteral,
  typeNil,
  typeNumber,
  typeReference,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';

describe('Print base type', () => {
  const printBaseType = createPrintBaseType((node) => node.type);

  [
    typeAny(),
    typeNil(),
    typeBoolean(),
    typeNumber(),
    typeString(),
    typeLiteral([]),
    typeReference(identifier('Test')),
  ].forEach((given) => {
    it(`should print base type ${given.type} without parenthesis`, () => {
      expect(printBaseType(given)).toEqual(given.type);
    });
  });

  [typeUnion([])].forEach((given) => {
    it('should print base type with parenthesis', () => {
      expect(printBaseType(given)).toEqual(`(${given.type})`);
    });
  });
});
