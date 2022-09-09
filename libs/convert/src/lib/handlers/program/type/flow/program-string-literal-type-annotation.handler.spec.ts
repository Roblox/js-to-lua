import {
  identifier,
  literalType,
  program,
  stringLiteral,
  typeAliasDeclaration,
  typeAnnotation,
  typeNumber,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../../program.handler';
import { getProgramNode } from '../../program.spec.utils';

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
      const expected = program([
        typeAliasDeclaration(
          identifier('Test'),
          typeUnion([typeNumber(), literalType(stringLiteral('foo'))])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle declaration with null literal type', () => {
      const given = getProgramNode(
        `
        let test: number | "bar" = "bar"
      `,
        { plugins: ['flow'] }
      );
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
