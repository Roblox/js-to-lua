import {
  identifier,
  program,
  typeAliasDeclaration,
  typeAny,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('TS: Type Alias Declaration', () => {
    it('should handle simple type declaration', () => {
      const given = getProgramNode(`
        type foo = any;
      `);
      const expected = program([
        typeAliasDeclaration(identifier('foo'), typeAny()),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
