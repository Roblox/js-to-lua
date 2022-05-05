import {
  functionDeclaration,
  identifier,
  nodeGroup,
  program,
  typeAliasDeclaration,
  typeAnnotation,
  typeBoolean,
  typeNumber,
  typeOptional,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../../program.handler';
import { getProgramNode } from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('NullableTypeAnnotation', () => {
    it('should handle type alias with nullable type', () => {
      const given = getProgramNode(
        `
        type Test = ?number;
      `,
        { plugins: ['flow'] }
      );
      const expected = program([
        typeAliasDeclaration(identifier('Test'), typeOptional(typeNumber())),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle function declaration with nullable type parameter', () => {
      const given = getProgramNode(
        `
        function testFn(testParam: ?boolean) {}
      `,
        { plugins: ['flow'] }
      );
      const expected = program([
        functionDeclaration(
          identifier('testFn'),
          [
            identifier(
              'testParam',
              typeAnnotation(typeOptional(typeBoolean()))
            ),
          ],
          nodeGroup([])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
