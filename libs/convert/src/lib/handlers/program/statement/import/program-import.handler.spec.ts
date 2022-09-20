import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  nodeGroup,
  typeAliasDeclaration,
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
  describe('Import Default Handler', () => {
    it(`should import relative default identifier - current directory`, () => {
      const given = getProgramNode(`
        import foo from './foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        identifier('script'),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import relative default identifier - parent directory`, () => {
      const given = getProgramNode(`
        import foo from '../foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        memberExpression(
                          identifier('script'),
                          '.',
                          identifier('Parent')
                        ),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import global default identifier`, () => {
      const given = getProgramNode(`
        import foo from 'foo/bar'
      `);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('Packages'),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import relative default type identifier`, () => {
      const given = getProgramNode(`
        import type foo from './foo/bar'
      `);
      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        identifier('script'),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          typeAliasDeclaration(
            identifier('foo'),
            memberExpression(
              identifier('barModule'),
              '.',
              identifier('default')
            )
          ),
        ]),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });

  describe('Import Named Handler', () => {
    it(`should import relative named identifier - current directory`, () => {
      const given = getProgramNode(`
        import { foo } from './foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        identifier('script'),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import relative named identifier - parent directory`, () => {
      const given = getProgramNode(`
        import { foo } from '../foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        memberExpression(
                          identifier('script'),
                          '.',
                          identifier('Parent')
                        ),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import relative multiple named identifiers`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from '../foo/bar'
      `);
      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        memberExpression(
                          identifier('script'),
                          '.',
                          identifier('Parent')
                        ),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizz'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('barModule'),
                  '.',
                  identifier('fizz')
                )
              ),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('buzz'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('barModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import global named identifier`, () => {
      const given = getProgramNode(`
        import { foo } from 'foo/bar'
      `);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('Packages'),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import global multiple named identifiers`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from 'foo/bar'
      `);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    memberExpression(
                      identifier('Packages'),
                      '.',
                      identifier('foo')
                    ),
                    '.',
                    identifier('bar')
                  ),
                ])
              ),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizz'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('barModule'),
                  '.',
                  identifier('fizz')
                )
              ),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('buzz'))],
            [
              variableDeclaratorValue(
                memberExpression(
                  identifier('barModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });

  describe('Import Namespace Handler', () => {
    it(`should import relative namespace - current directory`, () => {
      const given = getProgramNode(`
        import * as foo from './foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  memberExpression(
                    memberExpression(
                      identifier('script'),
                      '.',
                      identifier('Parent')
                    ),
                    '.',
                    identifier('foo')
                  ),
                  '.',
                  identifier('bar')
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import relative default identifier - parent directory`, () => {
      const given = getProgramNode(`
        import * as foo from '../foo/bar'
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  memberExpression(
                    memberExpression(
                      memberExpression(
                        identifier('script'),
                        '.',
                        identifier('Parent')
                      ),
                      '.',
                      identifier('Parent')
                    ),
                    '.',
                    identifier('foo')
                  ),
                  '.',
                  identifier('bar')
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should import global default identifier`, () => {
      const given = getProgramNode(`
        import * as foo from 'foo/bar'
      `);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    identifier('foo')
                  ),
                  '.',
                  identifier('bar')
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
