import {
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  tsExternalModuleReference,
  TSImportEqualsDeclaration,
  tsImportEqualsDeclaration,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withNeedsPackagesExtra } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsImportEqualsDeclarationHandler } from './ts-import-equals-declaration.handler';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

const handleTsImportDeclaration = createTsImportEqualsDeclarationHandler(
  mockNodeWithValueHandler
).handler;

const source = '';

describe('TSImportDeclaration Handler', () => {
  it(`should handle external global module import`, () => {
    const given: TSImportEqualsDeclaration = {
      ...tsImportEqualsDeclaration(
        babelIdentifier('foo'),
        tsExternalModuleReference(babelStringLiteral('bar'))
      ),
      importKind: 'value',
    };

    const expected = variableDeclaration(
      [variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('foo')))],
      [
        variableDeclaratorValue(
          withNeedsPackagesExtra(
            callExpression(identifier('require'), [
              memberExpression(identifier('Packages'), '.', identifier('bar')),
            ])
          )
        ),
      ]
    );

    expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
  });

  it(`should handle external relative module import`, () => {
    const given: TSImportEqualsDeclaration = {
      ...tsImportEqualsDeclaration(
        babelIdentifier('foo'),
        tsExternalModuleReference(babelStringLiteral('./bar'))
      ),
      importKind: 'value',
    };

    const expected = variableDeclaration(
      [variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('foo')))],
      [
        variableDeclaratorValue(
          callExpression(identifier('require'), [
            memberExpression(
              memberExpression(identifier('script'), '.', identifier('Parent')),
              '.',
              identifier('bar')
            ),
          ])
        ),
      ]
    );

    expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
  });

  describe('comments', () => {
    it(`should preserves outer comments`, () => {
      const given: TSImportEqualsDeclaration = withBabelComments(
        {
          ...tsImportEqualsDeclaration(
            babelIdentifier('foo'),
            tsExternalModuleReference(babelStringLiteral('./bar'))
          ),
          importKind: 'value',
        },
        'outer'
      );

      const expected = withLuaComments(
        variableDeclaration(
          [
            variableDeclaratorIdentifier(
              mockNodeWithValue(babelIdentifier('foo'))
            ),
          ],
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
        'outer'
      );

      expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
    });

    it(`should preserves id comments`, () => {
      const babelId = withBabelComments(babelIdentifier('foo'), 'id');
      const given: TSImportEqualsDeclaration = {
        ...tsImportEqualsDeclaration(
          babelId,
          tsExternalModuleReference(babelStringLiteral('./bar'))
        ),
        importKind: 'value',
      };

      const expected = variableDeclaration(
        [
          variableDeclaratorIdentifier(
            withLuaComments(mockNodeWithValue(babelId), 'id')
          ),
        ],
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
      );

      expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
    });

    it(`should preserves module reference comments`, () => {
      const given: TSImportEqualsDeclaration = {
        ...tsImportEqualsDeclaration(
          babelIdentifier('foo'),
          withBabelComments(
            tsExternalModuleReference(babelStringLiteral('./bar')),
            'moduleRef'
          )
        ),
        importKind: 'value',
      };

      const expected = variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('foo'))
          ),
        ],
        [
          withLuaComments(
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
            'moduleRef'
          ),
        ]
      );

      expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
    });

    it(`should preserves module reference expression comments`, () => {
      const given: TSImportEqualsDeclaration = {
        ...tsImportEqualsDeclaration(
          babelIdentifier('foo'),
          tsExternalModuleReference(
            withBabelComments(
              babelStringLiteral('./bar'),
              'moduleRefExpression'
            )
          )
        ),
        importKind: 'value',
      };

      const expected = variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('foo'))
          ),
        ],
        [
          variableDeclaratorValue(
            withLuaComments(
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
              ]),
              'moduleRefExpression'
            )
          ),
        ]
      );

      expect(handleTsImportDeclaration(source, {}, given)).toEqual(expected);
    });
  });
});
