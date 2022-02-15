import {
  identifier,
  typeAny,
  typeBoolean,
  typeLiteral,
  typeNil,
  typeNumber,
  typeOptional,
  typeReference,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { createPrintTypeOptional } from './print-type-optional';

describe('Print type optional', () => {
  const printTypeOptional = createPrintTypeOptional((node) => node.type);

  [
    typeOptional(typeAny()),
    typeOptional(typeNil()),
    typeOptional(typeBoolean()),
    typeOptional(typeNumber()),
    typeOptional(typeString()),
    typeOptional(typeLiteral([])),
    typeOptional(typeReference(identifier('Test'))),
  ].forEach((given) => {
    it(`should print base type ${given.type} without parenthesis`, () => {
      expect(printTypeOptional(given)).toEqual(`${given.typeAnnotation.type}?`);
    });
  });

  [typeOptional(typeUnion([]))].forEach((given) => {
    it('should print base type with parenthesis', () => {
      expect(printTypeOptional(given)).toEqual(
        `(${given.typeAnnotation.type})?`
      );
    });
  });
});
