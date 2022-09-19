import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  stringLiteral,
  typeAliasDeclaration,
  typeAnnotation,
  typeNil,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('NullLiteralTypeAnnotation', () => {
    it('should handle type alias with null literal type', () => {
      const given = getProgramNode(
        `
        type Test = string | null;
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Test'),
          typeUnion([
            typeString(),
            withTrailingConversionComment(
              typeNil(),
              "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle declaration with null literal type', () => {
      const given = getProgramNode(
        `
        let test: string | null = "foo"
      `,
        { plugins: ['flow'] }
      );
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [
            variableDeclaratorIdentifier({
              ...identifier('test'),
              typeAnnotation: typeAnnotation(
                typeUnion([
                  typeString(),
                  withTrailingConversionComment(
                    typeNil(),
                    "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
                  ),
                ])
              ),
            }),
          ],
          [variableDeclaratorValue(stringLiteral('foo'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
