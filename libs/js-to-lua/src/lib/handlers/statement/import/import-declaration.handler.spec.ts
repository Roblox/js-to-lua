import {
  identifier as babelIdentifier,
  importDeclaration as babelImportDeclaration,
  importDefaultSpecifier as babelImportDefaultSpecifier,
  importNamespaceSpecifier as babelImportNamespaceSpecifier,
  importSpecifier as babelImportSpecifier,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  callExpression,
  identifier,
  LuaIdentifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../../testUtils/mock-node';
import { createImportDeclarationHandler } from './import-declaration.handler';

const { handler } = createImportDeclarationHandler(
  mockNodeWithValueHandler,
  mockNodeWithValueHandler
);

const source = '';

describe('Import Declaration Handler', () => {
  it(`should import with default specifier`, () => {
    const given = babelImportDeclaration(
      [babelImportDefaultSpecifier(babelIdentifier('foo'))],
      babelStringLiteral('./foo')
    );

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
        ),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            callExpression(identifier('require'), [
              memberExpression(
                memberExpression(
                  identifier('script'),
                  '.',
                  identifier('Parent')
                ),
                '.',
                identifier('foo')
              ),
            ]),
            '.',
            identifier('default')
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with named specifier`, () => {
    const given = babelImportDeclaration(
      [babelImportSpecifier(babelIdentifier('foo'), babelIdentifier('foo'))],
      babelStringLiteral('./foo')
    );

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
        ),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            callExpression(identifier('require'), [
              memberExpression(
                memberExpression(
                  identifier('script'),
                  '.',
                  identifier('Parent')
                ),
                '.',
                identifier('foo')
              ),
            ]),
            '.',
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with aliased named specifier`, () => {
    const given = babelImportDeclaration(
      [
        babelImportSpecifier(
          babelIdentifier('fooAlias'),
          babelIdentifier('foo')
        ),
      ],
      babelStringLiteral('./foo')
    );

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(babelIdentifier('fooAlias'))
        ),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            callExpression(identifier('require'), [
              memberExpression(
                memberExpression(
                  identifier('script'),
                  '.',
                  identifier('Parent')
                ),
                '.',
                identifier('foo')
              ),
            ]),
            '.',
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with multiple named specifiers`, () => {
    const given = babelImportDeclaration(
      [
        babelImportSpecifier(babelIdentifier('foo'), babelIdentifier('foo')),
        babelImportSpecifier(babelIdentifier('bar'), babelIdentifier('bar')),
      ],
      babelStringLiteral('./foo')
    );

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('fooModule'))],
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
                identifier('foo')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('fooModule'),
              '.',
              mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('bar'))
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('fooModule'),
              '.',
              mockNodeWithValue<LuaIdentifier>(babelIdentifier('bar'))
            )
          ),
        ]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with namespace specifier`, () => {
    const given = babelImportDeclaration(
      [babelImportNamespaceSpecifier(babelIdentifier('foo'))],
      babelStringLiteral('./foo')
    );

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
        ),
      ],
      [
        variableDeclaratorValue(
          callExpression(identifier('require'), [
            memberExpression(
              memberExpression(identifier('script'), '.', identifier('Parent')),
              '.',
              identifier('foo')
            ),
          ])
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with all combined specifiers`, () => {
    const given = babelImportDeclaration(
      [
        babelImportDefaultSpecifier(babelIdentifier('fooDefault')),
        babelImportSpecifier(
          babelIdentifier('barNamed'),
          babelIdentifier('barNamed')
        ),
        babelImportSpecifier(
          babelIdentifier('fizzAliased'),
          babelIdentifier('fizz')
        ),
        babelImportNamespaceSpecifier(babelIdentifier('buzzNamespace')),
      ],
      babelStringLiteral('./foo')
    );

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('fooModule'))],
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
                identifier('foo')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('fooDefault'))
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('fooModule'),
              '.',
              identifier('default')
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('barNamed'))
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('fooModule'),
              '.',
              mockNodeWithValue<LuaIdentifier>(babelIdentifier('barNamed'))
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('fizzAliased'))
          ),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('fooModule'),
              '.',
              mockNodeWithValue<LuaIdentifier>(babelIdentifier('fizz'))
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('buzzNamespace'))
          ),
        ],
        [variableDeclaratorValue(identifier('fooModule'))]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
