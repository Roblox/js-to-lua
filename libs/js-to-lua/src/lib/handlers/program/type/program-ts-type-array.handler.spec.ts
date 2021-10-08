import {
  identifier,
  program,
  typeAliasDeclaration,
  typeNumber,
  typeReference,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS: Array Type', () => {
    it('should handle simple array type declaration', () => {
      const given = getProgramNode(`
        type NumberArray = number[];
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [typeNumber()])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle nested array type declarations', () => {
      const given = getProgramNode(`
        type NumberArray = number[][];
      `);
      const expected = program([
        typeAliasDeclaration(
          identifier('NumberArray'),
          typeReference(identifier('Array'), [
            typeReference(identifier('Array'), [typeNumber()]),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
