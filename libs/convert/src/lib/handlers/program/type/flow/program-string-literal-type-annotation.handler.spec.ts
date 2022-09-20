import {
  identifier,
  literalType,
  stringLiteral,
  typeAliasDeclaration,
  typeAnnotation,
  typeNumber,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('StringLiteralTypeAnnotation', () => {
    it('should handle type alias with null literal type', () => {
      const given = getProgramNode(
        `
        type Test = number | "foo";
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeUnion([typeNumber(), literalType(stringLiteral('foo'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle declaration with null literal type', () => {
      const given = getProgramNode(
        `
        let test: number | "bar" = "bar"
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier({
              ...identifier('test'),
              typeAnnotation: typeAnnotation(
                typeUnion([typeNumber(), literalType(stringLiteral('bar'))])
              ),
            }),
          ],
          [variableDeclaratorValue(stringLiteral('bar'))]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
