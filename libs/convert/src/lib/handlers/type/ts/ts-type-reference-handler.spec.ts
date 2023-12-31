import * as Babel from '@babel/types';
import {
  identifier as babelIdentifier,
  tsAnyKeyword as babelTsAnyKeyword,
  tsTypeParameterInstantiation as babelTsTypeParameterInstantiation,
  tsTypeReference as babelTsTypeReference,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  TsBuiltInTypeId,
  withTsBuiltInTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier, typeReference } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsQualifiedNameHandler } from './ts-qualified-name.handler';
import { createTsTypeReferenceHandler } from './ts-type-reference-handler';

const { mockNodeWithValueHandler } = testUtils;

describe('TSTypeReference handler', () => {
  type IdentifierHandlerFunction = Parameters<
    typeof createHandlerFunction<LuaIdentifier, Babel.Identifier>
  >[0];
  const mockIdentifierHandler = jest.fn<
    ReturnType<IdentifierHandlerFunction>,
    Parameters<IdentifierHandlerFunction>
  >((...args) => mockNodeWithValueHandler(...args));

  const tsTypeReferenceHandler = createTsTypeReferenceHandler(
    createHandlerFunction(mockIdentifierHandler),
    createTsQualifiedNameHandler(),
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  beforeEach(() => {
    mockIdentifierHandler.mockImplementation((...args) =>
      mockNodeWithValueHandler(...args)
    );
  });

  it('should handle TSTypeReference without generic params', () => {
    const given = babelTsTypeReference(babelIdentifier('TypeReference'));

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference'))
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTypeReference with generic params', () => {
    const given = babelTsTypeReference(
      babelIdentifier('TypeReference'),
      babelTsTypeParameterInstantiation([babelTsAnyKeyword()])
    );

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference')),
      [mockNodeWithValue(babelTsAnyKeyword())]
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSTypeReference with empty generic params', () => {
    const given = babelTsTypeReference(
      babelIdentifier('TypeReference'),
      babelTsTypeParameterInstantiation([])
    );

    const expected = typeReference(
      mockNodeWithValue(babelIdentifier('TypeReference'))
    );

    expect(tsTypeReferenceHandler(source, {}, given)).toEqual(expected);
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

    const actual = tsTypeReferenceHandler(source, {}, given);

    expect(actual).toEqual(expected);
  });
});
