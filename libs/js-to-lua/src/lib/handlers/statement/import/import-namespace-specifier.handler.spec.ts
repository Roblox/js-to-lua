import {
  identifier as babelIdentifier,
  importNamespaceSpecifier as babelImportNamespaceSpecifier,
} from '@babel/types';
import {
  identifier,
  LuaIdentifier,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../../testUtils/mock-node';
import { createImportNamespaceSpecifierHandler } from './import-namespace-specifier.handler';

const { handler } = createImportNamespaceSpecifierHandler(
  mockNodeWithValueHandler,
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
