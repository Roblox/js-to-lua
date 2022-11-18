import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  indexExpression,
  memberExpression,
  nodeGroup,
  stringLiteral,
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

    it(`should import relative multiple named identifiers - with dot in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from '../foo/bar.js'
      `);
      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barJsModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
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
                    stringLiteral('bar.js')
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
                  identifier('barJsModule'),
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
                  identifier('barJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });

    it(`should import relative multiple named identifiers - with dash in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from '../foo/bar-js'
      `);
      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('barJsModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
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
                    stringLiteral('bar-js')
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
                  identifier('barJsModule'),
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
                  identifier('barJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });

    it(`should import relative multiple named identifiers - with mixed dot and dash in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from '../foo.bar-baz/fizz-buzz.js'
      `);
      const expected = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizzBuzzJsModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
                    indexExpression(
                      memberExpression(
                        memberExpression(
                          identifier('script'),
                          '.',
                          identifier('Parent')
                        ),
                        '.',
                        identifier('Parent')
                      ),
                      stringLiteral('foo.bar-baz')
                    ),
                    stringLiteral('fizz-buzz.js')
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
                  identifier('fizzBuzzJsModule'),
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
                  identifier('fizzBuzzJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
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
            [variableDeclaratorIdentifier(identifier('fooBarModule'))],
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
                  identifier('fooBarModule'),
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
                  identifier('fooBarModule'),
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

    it(`should import global multiple named identifiers - with dot in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from 'foo/bar.js'
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
            [variableDeclaratorIdentifier(identifier('fooBarJsModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
                    memberExpression(
                      identifier('Packages'),
                      '.',
                      identifier('foo')
                    ),
                    stringLiteral('bar.js')
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
                  identifier('fooBarJsModule'),
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
                  identifier('fooBarJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });

    it(`should import global multiple named identifiers - with dash in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from 'foo/bar-js'
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
            [variableDeclaratorIdentifier(identifier('fooBarJsModule'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
                    memberExpression(
                      identifier('Packages'),
                      '.',
                      identifier('foo')
                    ),
                    stringLiteral('bar-js')
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
                  identifier('fooBarJsModule'),
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
                  identifier('fooBarJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
    });

    it(`should import global multiple named identifiers - with mixed dot and dash in imported path`, () => {
      const given = getProgramNode(`
        import { fizz, buzz } from 'foo.bar-baz/fizz-buzz.js'
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
            [
              variableDeclaratorIdentifier(
                identifier('fooBarBazFizzBuzzJsModule')
              ),
            ],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  indexExpression(
                    indexExpression(
                      identifier('Packages'),
                      stringLiteral('foo.bar-baz')
                    ),
                    stringLiteral('fizz-buzz.js')
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
                  identifier('fooBarBazFizzBuzzJsModule'),
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
                  identifier('fooBarBazFizzBuzzJsModule'),
                  '.',
                  identifier('buzz')
                )
              ),
            ]
          ),
        ]),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(JSON.stringify(actual, undefined, 2)).toEqual(
        JSON.stringify(expected, undefined, 2)
      );
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
