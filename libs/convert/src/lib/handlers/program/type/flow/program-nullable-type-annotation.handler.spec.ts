import {
  functionDeclaration,
  identifier,
  nodeGroup,
  typeAliasDeclaration,
  typeAnnotation,
  typeBoolean,
  typeNumber,
  typeOptional,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

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
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(identifier('Test'), typeOptional(typeNumber())),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle function declaration with nullable type parameter', () => {
      const given = getProgramNode(
        `
        function testFn(testParam: ?boolean) {}
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
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

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
