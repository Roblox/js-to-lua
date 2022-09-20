import {
  callExpression,
  identifier,
  memberExpression,
  nodeGroup,
  typeAliasDeclaration,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

describe('Program handler', () => {
  describe('QualifiedTypeIdentifier', () => {
    it('should convert qualified type identifier', () => {
      const source = `
        type Foo = Bar.Baz
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar_Baz'))
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert nested qualified type identifier', () => {
      const source = `
        type Foo = Bar.Baz.Fizz.Buzz
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = programWithUpstreamComment([
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar_Baz_Fizz_Buzz'))
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert qualified type identifier and add additional type imports', () => {
      const source = `
        import type {Bar} from './bar'
        type Foo = Bar.Baz
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('script'),
                      '.',
                      identifier('Parent')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('Bar'),
              memberExpression(identifier('barModule'), '.', identifier('Bar'))
            ),
            typeAliasDeclaration(
              identifier('Bar_Baz'),
              memberExpression(
                identifier('barModule'),
                '.',
                identifier('Bar_Baz')
              )
            ),
          ]),
        ]),
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar_Baz'))
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert nested qualified type identifier and add additional type imports', () => {
      const source = `
        import type {Bar} from './bar'
        type Foo = Bar.Baz.Fizz.Buzz
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('script'),
                      '.',
                      identifier('Parent')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('Bar'),
              memberExpression(identifier('barModule'), '.', identifier('Bar'))
            ),
            typeAliasDeclaration(
              identifier('Bar_Baz_Fizz_Buzz'),
              memberExpression(
                identifier('barModule'),
                '.',
                identifier('Bar_Baz_Fizz_Buzz')
              )
            ),
          ]),
        ]),
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar_Baz_Fizz_Buzz'))
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert multiple qualified type identifier and add additional type imports', () => {
      const source = `
        import type {Bar} from './bar'
        type Foo = Bar.Baz.Fizz.Buzz
        type Jazz = Bar.Jazz
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('script'),
                      '.',
                      identifier('Parent')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('Bar'),
              memberExpression(identifier('barModule'), '.', identifier('Bar'))
            ),
            typeAliasDeclaration(
              identifier('Bar_Baz_Fizz_Buzz'),
              memberExpression(
                identifier('barModule'),
                '.',
                identifier('Bar_Baz_Fizz_Buzz')
              )
            ),
            typeAliasDeclaration(
              identifier('Bar_Jazz'),
              memberExpression(
                identifier('barModule'),
                '.',
                identifier('Bar_Jazz')
              )
            ),
          ]),
        ]),
        typeAliasDeclaration(
          identifier('Foo'),
          typeReference(identifier('Bar_Baz_Fizz_Buzz'))
        ),
        typeAliasDeclaration(
          identifier('Jazz'),
          typeReference(identifier('Bar_Jazz'))
        ),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
