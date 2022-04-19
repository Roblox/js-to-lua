import {
  anyTypeAnnotation,
  arrayTypeAnnotation,
  booleanTypeAnnotation,
  functionTypeAnnotation,
  functionTypeParam as babelFunctionTypeParam,
  genericTypeAnnotation,
  identifier as babelIdentifier,
  stringTypeAnnotation,
  typeAnnotation as babelTypeAnnotation,
  typeParameter as babelTypeParameter,
  typeParameterDeclaration as babelTypeParameterDeclaration,
  typeParameterInstantiation,
  variance,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  functionTypeParam,
  identifier,
  LuaType,
  typeAny,
  typeFunction,
  typeParameterDeclaration,
  typeReference,
  typeVariadicFunction,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
} from '@js-to-lua/lua-types/test-utils';
import { createFunctionTypeAnnotationHandler } from './function-type-annotation.handler';

const { mockNodeWithValueHandler } = testUtils;

function typeParameterWithName(
  name: string,
  ...rest: Parameters<typeof babelTypeParameter>
): ReturnType<typeof babelTypeParameter> {
  return {
    ...babelTypeParameter(...rest),
    name,
  };
}

describe('FunctionTypeAnnotation handler', () => {
  const { handler } = createFunctionTypeAnnotationHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  );

  const source = '';

  it('should handle FunctionTypeAnnotation with no parameters', () => {
    const given = functionTypeAnnotation(null, [], null, anyTypeAnnotation());
    const expected = typeFunction([], mockNodeWithValue(anyTypeAnnotation()));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle FunctionTypeAnnotation with parameters', () => {
    const given = functionTypeAnnotation(
      null,
      [babelFunctionTypeParam(babelIdentifier('foo'), booleanTypeAnnotation())],
      null,
      anyTypeAnnotation()
    );
    const expected = typeFunction(
      [
        functionTypeParam(
          mockNodeWithValue(babelIdentifier('foo')),
          mockNodeWithValue(booleanTypeAnnotation())
        ),
      ],
      mockNodeWithValue(anyTypeAnnotation())
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle FunctionTypeAnnotation with parameters without name', () => {
    const given = functionTypeAnnotation(
      null,
      [babelFunctionTypeParam(null, booleanTypeAnnotation())],
      null,
      anyTypeAnnotation()
    );
    const expected = typeFunction(
      [functionTypeParam(null, mockNodeWithValue(booleanTypeAnnotation()))],
      mockNodeWithValue(anyTypeAnnotation())
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it.each([
    {
      givenType: genericTypeAnnotation(
        babelIdentifier('Array'),
        typeParameterInstantiation([stringTypeAnnotation()])
      ),
      expectedType: mockNodeWithValue<LuaType>(stringTypeAnnotation()),
    },
    {
      givenType: arrayTypeAnnotation(stringTypeAnnotation()),
      expectedType: mockNodeWithValue<LuaType>(stringTypeAnnotation()),
    },
  ])(
    'should handle FunctionTypeAnnotation with parameters and rest element (known type): $givenType',
    ({ givenType, expectedType }) => {
      const given = functionTypeAnnotation(
        null,
        [
          babelFunctionTypeParam(
            babelIdentifier('foo'),
            booleanTypeAnnotation()
          ),
        ],
        babelFunctionTypeParam(babelIdentifier('rest'), givenType),
        anyTypeAnnotation()
      );

      const expected = typeVariadicFunction(
        [
          functionTypeParam(
            mockNodeWithValue(babelIdentifier('foo')),
            mockNodeWithValue(booleanTypeAnnotation())
          ),
        ],
        expectedType,
        mockNodeWithValue(anyTypeAnnotation())
      );

      expect(handler(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    genericTypeAnnotation(
      babelIdentifier('Array'),
      typeParameterInstantiation([])
    ),
    genericTypeAnnotation(babelIdentifier('Array')),
    genericTypeAnnotation(babelIdentifier('Args')),
  ])(
    'should handle FunctionTypeAnnotation with parameters and rest element (unknown type): $givenType',
    (givenType) => {
      const source = '(foo:boolean, ...rest: GivenType) -> any';

      const given = functionTypeAnnotation(
        null,
        [
          babelFunctionTypeParam(
            babelIdentifier('foo'),
            booleanTypeAnnotation()
          ),
        ],
        babelFunctionTypeParam(
          babelIdentifier('rest'),
          withLocation({ start: 23, end: 32 })(givenType)
        ),
        anyTypeAnnotation()
      );

      const expected = typeVariadicFunction(
        [
          functionTypeParam(
            mockNodeWithValue(babelIdentifier('foo')),
            mockNodeWithValue(booleanTypeAnnotation())
          ),
        ],
        withTrailingConversionComment(
          typeAny(),
          `ROBLOX CHECK: check correct type of elements. Upstream type: <GivenType>`
        ),
        mockNodeWithValue(anyTypeAnnotation())
      );

      expect(handler(source, {}, given)).toEqual(expected);
    }
  );

  it('should handle FunctionTypeAnnotation with empty generic parameters', () => {
    const given = functionTypeAnnotation(
      babelTypeParameterDeclaration([]),
      [],
      null,
      anyTypeAnnotation()
    );
    const expected = typeFunction([], mockNodeWithValue(anyTypeAnnotation()));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle FunctionTypeAnnotation with generic parameters', () => {
    const given = functionTypeAnnotation(
      babelTypeParameterDeclaration([typeParameterWithName('T')]),
      [],
      null,
      anyTypeAnnotation()
    );
    const expected = typeFunction(
      [],
      mockNodeWithValue(anyTypeAnnotation()),
      typeParameterDeclaration([typeReference(identifier('T'))])
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle FunctionTypeAnnotation with generic parameters and rest element', () => {
    const given = functionTypeAnnotation(
      babelTypeParameterDeclaration([typeParameterWithName('T')]),
      [],
      babelFunctionTypeParam(
        babelIdentifier('rest'),
        genericTypeAnnotation(
          babelIdentifier('Array'),
          typeParameterInstantiation([
            genericTypeAnnotation(babelIdentifier('T')),
          ])
        )
      ),
      anyTypeAnnotation()
    );
    const expected = typeVariadicFunction(
      [],
      mockNodeWithValue(genericTypeAnnotation(babelIdentifier('T'))),
      mockNodeWithValue(anyTypeAnnotation()),
      typeParameterDeclaration([typeReference(identifier('T'))])
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  describe('with unsupported syntax', () => {
    it('should add comment about unsupported type constraint', () => {
      const source = `type Foo = <T: string>() => any`;

      const given = functionTypeAnnotation(
        babelTypeParameterDeclaration([
          withLocation({ start: 12, end: 21 })(
            typeParameterWithName(
              'T',
              babelTypeAnnotation(stringTypeAnnotation())
            )
          ),
        ]),
        [],
        null,
        anyTypeAnnotation()
      );
      const expected = typeFunction(
        [],
        mockNodeWithValue(anyTypeAnnotation()),
        typeParameterDeclaration([
          withTrailingConversionComment(
            typeReference(identifier('T')),
            'ROBLOX CHECK: upstream type uses type constraint which is not supported by Luau',
            'T: string'
          ),
        ])
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });
    it('should add comment about unsupported type constraint', () => {
      const source = `type Foo = <-T>() => any`;

      const given = functionTypeAnnotation(
        babelTypeParameterDeclaration([
          withLocation({ start: 12, end: 14 })(
            typeParameterWithName('T', null, null, variance('minus'))
          ),
        ]),
        [],
        null,
        anyTypeAnnotation()
      );
      const expected = typeFunction(
        [],
        mockNodeWithValue(anyTypeAnnotation()),
        typeParameterDeclaration([
          withTrailingConversionComment(
            typeReference(identifier('T')),
            'ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau',
            '-T'
          ),
        ])
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });
    it('should add comment about unsupported type constraint and variance sigil', () => {
      const source = `type Foo = <+T: string>() => any`;

      const given = functionTypeAnnotation(
        babelTypeParameterDeclaration([
          withLocation({ start: 12, end: 22 })(
            typeParameterWithName(
              'T',
              babelTypeAnnotation(stringTypeAnnotation()),
              null,
              variance('plus')
            )
          ),
        ]),
        [],
        null,
        anyTypeAnnotation()
      );
      const expected = typeFunction(
        [],
        mockNodeWithValue(anyTypeAnnotation()),
        typeParameterDeclaration([
          withTrailingConversionComment(
            typeReference(identifier('T')),
            'ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau',
            'ROBLOX CHECK: upstream type uses type constraint which is not supported by Luau',
            '+T: string'
          ),
        ])
      );

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });
});
