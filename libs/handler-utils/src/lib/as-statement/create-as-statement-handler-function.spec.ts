import { identifier as babelIdentifier } from '@babel/types';
import { identifier } from '@js-to-lua/lua-types';
import { withBabelComments, withLuaComments } from '../test-utils';
import { createAsStatementHandlerFunction } from './create-as-statement-handler-function';
import { asStatementReturnTypeInline } from './return-type-inline';
import { asStatementReturnTypeWithIdentifier } from './return-type-with-identifiers';

describe('Create as statement handler function', () => {
  it.each([
    asStatementReturnTypeWithIdentifier([], [], identifier('foo')),
    asStatementReturnTypeInline([], identifier('foo'), []),
  ])(
    'should create a curried handler function: [#%#] %s',
    (givenReturnValue) => {
      const handlerFunction = createAsStatementHandlerFunction(
        () => givenReturnValue
      );

      expect(typeof handlerFunction).toBe('function');
      expect(typeof handlerFunction()).toBe('function');
      expect(typeof handlerFunction('source')).toBe('function');
      expect(typeof handlerFunction('source', {})).toBe('function');
      expect(handlerFunction('source', {}, babelIdentifier('foo'))).toEqual(
        givenReturnValue
      );
    }
  );

  describe.each([
    {
      givenReturnValue: asStatementReturnTypeWithIdentifier(
        [],
        [],
        identifier('foo')
      ),
      expectedReturnValue: asStatementReturnTypeWithIdentifier(
        [],
        [],
        withLuaComments(identifier('foo'))
      ),
    },
    {
      givenReturnValue: asStatementReturnTypeInline([], identifier('foo'), []),
      expectedReturnValue: asStatementReturnTypeInline(
        [],
        withLuaComments(identifier('foo')),
        []
      ),
    },
  ])(
    'with comments [#%#] for value: %s',
    ({ givenReturnValue, expectedReturnValue }) => {
      it('should add all comments from the source node', () => {
        const handlerFunction = createAsStatementHandlerFunction(
          () => givenReturnValue
        );

        const sourceNode = withBabelComments(babelIdentifier('foo'));

        expect(handlerFunction('source', {}, sourceNode)).toEqual(
          expectedReturnValue
        );
      });

      it('should skip adding comments from the source node', () => {
        const handlerFunction = createAsStatementHandlerFunction(
          () => givenReturnValue,
          { skipComments: true }
        );

        const sourceNode = withBabelComments(babelIdentifier('foo'));

        expect(handlerFunction('source', {}, sourceNode)).toEqual(
          givenReturnValue
        );
      });
    }
  );
});
