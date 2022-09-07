import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  createWithQualifiedNameAdditionalImportExtra,
  PolyfillTypeID,
  withOriginalIds,
  withPolyfillTypeExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  typeAny,
  typeReference,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { createFlowGenericTypeAnnotationHandler } from './flow-generic-type-annotation.handler';

const { mockNodeWithValueHandler } = testUtils;

const handler = createFlowGenericTypeAnnotationHandler(
  createHandlerFunction((_source, _config, node: Babel.Identifier) =>
    identifier(node.name)
  ),
  mockNodeWithValueHandler
).handler;

const source = '';

describe('Flow - GenericAnnotationType handler', () => {
  it('should handle generic type annotation without params', () => {
    const given = Babel.genericTypeAnnotation(Babel.identifier('A'));
    const expected = typeReference(identifier('A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with empty params', () => {
    const given = Babel.genericTypeAnnotation(
      Babel.identifier('A'),
      Babel.typeParameterInstantiation([])
    );
    const expected = typeReference(identifier('A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with one param', () => {
    const given = Babel.genericTypeAnnotation(
      Babel.identifier('A'),
      Babel.typeParameterInstantiation([Babel.anyTypeAnnotation()])
    );

    const expected = typeReference(identifier('A'), [
      mockNodeWithValue(Babel.anyTypeAnnotation()),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with multiple params', () => {
    const given = Babel.genericTypeAnnotation(
      Babel.identifier('A'),
      Babel.typeParameterInstantiation([
        Babel.anyTypeAnnotation(),
        Babel.stringTypeAnnotation(),
        Babel.numberTypeAnnotation(),
      ])
    );
    const expected = typeReference(identifier('A'), [
      mockNodeWithValue(Babel.anyTypeAnnotation()),
      mockNodeWithValue(Babel.stringTypeAnnotation()),
      mockNodeWithValue(Babel.numberTypeAnnotation()),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle node of type QualifiedTypeIdentifier', () => {
    const given = Babel.genericTypeAnnotation(
      Babel.qualifiedTypeIdentifier(
        Babel.identifier('A'),
        Babel.identifier('B')
      )
    );
    const expected = typeReference(
      createWithQualifiedNameAdditionalImportExtra(
        'B_A',
        'B'
      )(withOriginalIds(['B', 'A'], identifier('B_A')))
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
  it('should handle node of type QualifiedTypeIdentifier with nested QualifiedTypeIdentifiers', () => {
    const given = Babel.genericTypeAnnotation(
      Babel.qualifiedTypeIdentifier(
        Babel.identifier('A'),
        Babel.qualifiedTypeIdentifier(
          Babel.identifier('B'),
          Babel.identifier('C')
        )
      )
    );
    const expected = typeReference(
      createWithQualifiedNameAdditionalImportExtra(
        'C_B_A',
        'C'
      )(withOriginalIds(['C', 'B', 'A'], identifier('C_B_A')))
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should gracefully handle unhandled case', () => {
    const source = 'type Foo = NaN';

    const handler = createFlowGenericTypeAnnotationHandler(
      createHandlerFunction(() => unhandledExpression()),
      mockNodeWithValueHandler
    ).handler;

    const given: Babel.GenericTypeAnnotation = {
      ...Babel.genericTypeAnnotation(Babel.identifier('NaN')),
      start: 11,
      end: 14,
    };
    const expected = withTrailingConversionComment(
      typeAny(),
      'ROBLOX TODO: Unhandled node for type: GenericTypeAnnotation',
      'NaN'
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  describe('should add polyfills', () => {
    it.each([
      ['Array', ['T']],
      ['Error', undefined],
      ['Map', ['T', 'U']],
      ['Object', undefined],
      ['Promise', ['T']],
      ['Set', ['T']],
      ['WeakMap', ['T', 'U']],
    ] as Array<[string, NonEmptyArray<string> | undefined]>)(
      'should autoimport %s type from polyfill',
      (name, generics) => {
        const given = Babel.genericTypeAnnotation(
          Babel.identifier(name),
          generics
            ? Babel.typeParameterInstantiation(
                generics.map(() => Babel.anyTypeAnnotation())
              )
            : undefined
        );
        const expected = withPolyfillTypeExtra(
          name as PolyfillTypeID,
          generics
        )(
          typeReference(
            identifier(name),
            generics
              ? ([
                  ...generics.map(() =>
                    mockNodeWithValue<LuaType, Babel.AnyTypeAnnotation>(
                      Babel.anyTypeAnnotation()
                    )
                  ),
                ] as NonEmptyArray<LuaType>)
              : undefined
          )
        );

        expect(handler(source, {}, given)).toEqual(expected);
      }
    );

    it('should not autoimport PromiseLike type from polyfill', () => {
      const given = Babel.genericTypeAnnotation(
        Babel.identifier('PromiseLike'),
        Babel.typeParameterInstantiation([Babel.anyTypeAnnotation()])
      );
      const expected = typeReference(identifier('PromiseLike'), [
        mockNodeWithValue<LuaType, Babel.AnyTypeAnnotation>(
          Babel.anyTypeAnnotation()
        ),
      ]);

      expect(handler(source, {}, given)).toEqual(expected);
    });
  });
});
