import {
  anyTypeAnnotation,
  identifier as babelIdentifier,
  typeAlias as babelTypeAlias,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { typeAliasDeclaration } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createFlowTypeAliasHandler } from './type-alias.handler';

const { mockNodeWithValueHandler, withBabelComments, withLuaComments } =
  testUtils;

describe('Flow - TypeAlias handler', () => {
  const handler = createFlowTypeAliasHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle node', () => {
    const given = babelTypeAlias(
      babelIdentifier('Id'),
      null,
      anyTypeAnnotation()
    );
    const expected = typeAliasDeclaration(
      mockNodeWithValue(babelIdentifier('Id')),
      mockNodeWithValue(anyTypeAnnotation())
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = withBabelComments(
      babelTypeAlias(babelIdentifier('Id'), null, anyTypeAnnotation())
    );
    const expected = withLuaComments(
      typeAliasDeclaration(
        mockNodeWithValue(babelIdentifier('Id')),
        mockNodeWithValue(anyTypeAnnotation())
      )
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
