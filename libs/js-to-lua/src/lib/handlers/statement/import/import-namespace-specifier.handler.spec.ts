import {
  identifier as babelIdentifier,
  importNamespaceSpecifier as babelImportNamespaceSpecifier,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';

import {
  identifier,
  LuaIdentifier,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createImportNamespaceSpecifierHandler } from './import-namespace-specifier.handler';

const { handler } = createImportNamespaceSpecifierHandler(
  testUtils.mockNodeWithValueHandler,
  identifier('mockIdentifier')
);

const source = '';

describe('Import Namespace Specifier Handler', () => {
  it(`should import with namespace specifier`, () => {
    const given = babelImportNamespaceSpecifier(babelIdentifier('foo'));

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          mockNodeWithValue<LuaIdentifier>(babelIdentifier('foo'))
        ),
      ],
      [variableDeclaratorValue(identifier('mockIdentifier'))]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
