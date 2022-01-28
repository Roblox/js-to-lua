import {
  identifier as babelIdentifier,
  importSpecifier as babelImportSpecifier,
} from '@babel/types';
import {
  identifier,
  LuaIdentifier,
  memberExpression,
  typeAliasDeclaration,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../../testUtils/mock-node';
import { createImportNamedSpecifierHandler } from './import-named-specifier.handler';

const { handler } = createImportNamedSpecifierHandler(
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  identifier('mockIdentifier')
);

const source = '';

describe('Import Named Specifier Handler', () => {
  it(`should import with named specifier`, () => {
    const given = babelImportSpecifier(
      babelIdentifier('foo'),
      babelIdentifier('foo')
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
            identifier('mockIdentifier'),
            '.',
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with aliased named specifier`, () => {
    const given = babelImportSpecifier(
      babelIdentifier('fooAlias'),
      babelIdentifier('foo')
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
            identifier('mockIdentifier'),
            '.',
            mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with named type specifier`, () => {
    const given = babelImportSpecifier(
      babelIdentifier('foo'),
      babelIdentifier('foo')
    );

    const expected = typeAliasDeclaration(
      mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo')),
      memberExpression(
        identifier('mockIdentifier'),
        '.',
        mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
      )
    );

    expect(handler(source, { isTypeImport: true }, given)).toEqual(expected);
  });

  it(`should import with named aliased type specifier`, () => {
    const given = babelImportSpecifier(
      babelIdentifier('fooAlias'),
      babelIdentifier('foo')
    );

    const expected = typeAliasDeclaration(
      mockNodeWithValue<LuaIdentifier>(babelIdentifier('fooAlias')),
      memberExpression(
        identifier('mockIdentifier'),
        '.',
        mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
      )
    );

    expect(handler(source, { isTypeImport: true }, given)).toEqual(expected);
  });
});
