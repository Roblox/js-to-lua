import {
  identifier as babelIdentifier,
  importDefaultSpecifier as babelImportDefaultSpecifier,
} from '@babel/types';
import {
  identifier,
  LuaIdentifier,
  memberExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../../testUtils/mock-node';
import { createImportDefaultSpecifierHandler } from './import-default-specifier.handler';

const { handler } = createImportDefaultSpecifierHandler(
  mockNodeWithValueHandler,
  identifier('mockIdentifier')
);

const source = '';

describe('Import Default Specifier Handler', () => {
  it(`should import with default specifier`, () => {
    const given = babelImportDefaultSpecifier(babelIdentifier('foo'));

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
            identifier('default')
          )
        ),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
