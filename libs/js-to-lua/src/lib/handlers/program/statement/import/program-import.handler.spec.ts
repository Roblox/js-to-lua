import {
  callExpression,
  identifier,
  memberExpression,
  nodeGroup,
  program,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../../program.spec.utils';
import { handleProgram } from '../../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Import Default Handler', () => {
    it(`should import relative default identifier - current directory`, () => {
      const given = getProgramNode(`
        import foo from './foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import relative default identifier - parent directory`, () => {
      const given = getProgramNode(`
        import foo from '../foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('Parent'),
                        '.',
                        memberExpression(
                          identifier('foo'),
                          '.',
                          identifier('bar')
                        )
                      )
                    )
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import global default identifier`, () => {
      const given = getProgramNode(`
        import foo from 'foo/bar'
      `);
      const expected = program([
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
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ]),
                '.',
                identifier('default')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('Import Named Handler', () => {
    it(`should import relative named identifier - current directory`, () => {
      const given = getProgramNode(`
        import { foo } from './foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import relative named identifier - parent directory`, () => {
      const given = getProgramNode(`
        import { foo } from '../foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              memberExpression(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('Parent'),
                        '.',
                        memberExpression(
                          identifier('foo'),
                          '.',
                          identifier('bar')
                        )
                      )
                    )
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import relative multiple named identifiers`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from '../foo/bar'
      `);
      const expected = program([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('script'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('Parent'),
                        '.',
                        memberExpression(
                          identifier('foo'),
                          '.',
                          identifier('bar')
                        )
                      )
                    )
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import global named identifier`, () => {
      const given = getProgramNode(`
        import { foo } from 'foo/bar'
      `);
      const expected = program([
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
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ]),
                '.',
                identifier('foo')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import global multiple named identifiers`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from 'foo/bar'
      `);
      const expected = program([
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
                    identifier('Packages'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });

  describe('Import Namespace Handler', () => {
    it(`should import relative namespace - current directory`, () => {
      const given = getProgramNode(`
        import * as foo from './foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('script'),
                  '.',
                  memberExpression(
                    identifier('Parent'),
                    '.',
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  )
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import relative default identifier - parent directory`, () => {
      const given = getProgramNode(`
        import * as foo from '../foo/bar'
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('script'),
                  '.',
                  memberExpression(
                    identifier('Parent'),
                    '.',
                    memberExpression(
                      identifier('Parent'),
                      '.',
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    )
                  )
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should import global default identifier`, () => {
      const given = getProgramNode(`
        import * as foo from 'foo/bar'
      `);
      const expected = program([
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
                  identifier('Packages'),
                  '.',
                  memberExpression(identifier('foo'), '.', identifier('bar'))
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
