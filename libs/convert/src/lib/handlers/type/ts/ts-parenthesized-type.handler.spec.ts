import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import { LuaType, typeAny } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsParenthesizedTypeHandler } from './ts-parenthesized-type.handler';

const { withBabelComments, withLuaComments, mockNodeWithValueHandler } =
  testUtils;

describe('TSParenthesizedType handler', () => {
  type TSTypeHandlerFunction = Parameters<
    typeof createHandlerFunction<LuaType, Babel.TSType>
  >[0];
  const mockTSTypeHandler = jest.fn<
    ReturnType<TSTypeHandlerFunction>,
    Parameters<TSTypeHandlerFunction>
  >((...args) => mockNodeWithValueHandler(...args));
  const handler = createTsParenthesizedTypeHandler(
    createHandlerFunction(mockTSTypeHandler)
  ).handler;

  const source = '';

  it('should handle node', () => {
    const given = Babel.tsParenthesizedType(Babel.tsAnyKeyword());
    const expected = mockNodeWithValue(Babel.tSAnyKeyword());

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should preserve comments', () => {
    mockTSTypeHandler.mockImplementationOnce(() => typeAny());

    const given = withBabelComments(
      Babel.tsParenthesizedType(
        withBabelComments(Babel.tsAnyKeyword(), 'inner')
      ),
      'outer'
    );
    const expected = withLuaComments(
      withLuaComments(typeAny(), 'inner'),
      'outer'
    );

    const actual = handler(source, {}, given);
    expect(actual).toEqual(expected);
  });
});
