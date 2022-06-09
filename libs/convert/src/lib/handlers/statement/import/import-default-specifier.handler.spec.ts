import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';

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
import { createImportDefaultSpecifierHandler } from './import-default-specifier.handler';

const { handler } = createImportDefaultSpecifierHandler(
  testUtils.mockNodeWithValueHandler,
  identifier('mockIdentifier')
);

const source = '';

describe('Import Default Specifier Handler', () => {
  it(`should import with default specifier`, () => {
    const given = Babel.importDefaultSpecifier(Babel.identifier('foo'));

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(Babel.identifier('foo'))
        ),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            identifier('mockIdentifier'),
            '.',
            identifier('default')
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should import with default type specifier`, () => {
    const given = Babel.importDefaultSpecifier(Babel.identifier('foo'));

    const expected = typeAliasDeclaration(
      mockNodeWithValue<LuaIdentifier>(Babel.identifier('foo')),
      memberExpression(identifier('mockIdentifier'), '.', identifier('default'))
    );

    expect(handler(source, { isTypeImport: true }, given)).toEqual(expected);
  });
});
