import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  TsBuiltInTypeId,
  withTsBuiltInTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier, typeReference } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsQualifiedNameHandler } from './ts-qualified-name.handler';
import { createTsTypeReferenceBuiltInHandler } from './ts-type-reference-built-in.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('TsTypeReference built-in handler', () => {
  type IdentifierHandlerFunction = Parameters<
    typeof createHandlerFunction<LuaIdentifier, Babel.Identifier>
  >[0];
  const mockIdentifierHandler = jest.fn<
    ReturnType<IdentifierHandlerFunction>,
    Parameters<IdentifierHandlerFunction>
  >((...args) => mockNodeWithValueHandler(...args));

  const handleTsTypeReferenceBuiltIn = createTsTypeReferenceBuiltInHandler(
    createHandlerFunction(mockIdentifierHandler),
    createTsQualifiedNameHandler(),
    mockNodeWithValueHandler
  );

  const source = '';

  beforeEach(() => {
    mockIdentifierHandler.mockImplementation((...args) =>
      mockNodeWithValueHandler(...args)
    );
  });

  it.each(
    Array<{ name: TsBuiltInTypeId; generics: string[] }>(
      {
        name: 'Awaited',
        generics: ['T'],
      },
      {
        name: 'Record',
        generics: ['K', 'T'],
      },
      {
        name: 'Pick',
        generics: ['T', 'K'],
      },
      {
        name: 'Exclude',
        generics: ['T', 'U'],
      }
    )
  )('should handle built-in types', ({ name, generics }) => {
    mockIdentifierHandler.mockImplementation((source, config, node) =>
      identifier(node.name)
    );

    const given = Babel.tsTypeReference(
      Babel.identifier(name),
      Babel.tsTypeParameterInstantiation([
        Babel.tsTypeReference(Babel.identifier('Foo')),
      ])
    );

    const expected = withTsBuiltInTypeExtra(
      name,
      generics
    )(
      typeReference(identifier(name), [
        mockNodeWithValue(Babel.tsTypeReference(Babel.identifier('Foo'))),
      ])
    );

    const actual = handleTsTypeReferenceBuiltIn(source, {}, given);

    expect(actual).toEqual(expected);
  });

  it.each(['NotAwaited', 'NotRecord', 'NotPick', 'NotExclude'])(
    'should NOT handle NOT built-in types',
    (name) => {
      mockIdentifierHandler.mockImplementation((source, config, node) =>
        identifier(node.name)
      );

      const given = Babel.tsTypeReference(
        Babel.identifier(name),
        Babel.tsTypeParameterInstantiation([
          Babel.tsTypeReference(Babel.identifier('Foo')),
        ])
      );

      const expected = undefined;

      const actual = handleTsTypeReferenceBuiltIn(source, {}, given);

      expect(actual).toEqual(expected);
    }
  );
});
