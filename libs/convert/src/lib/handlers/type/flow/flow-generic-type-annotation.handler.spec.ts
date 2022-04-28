import {
  anyTypeAnnotation as babelAnyTypeAnnotation,
  genericTypeAnnotation as babelGenericTypeAnnotation,
  GenericTypeAnnotation,
  identifier as babelIdentifier,
  Identifier as BabelIdentifier,
  numberTypeAnnotation as babelNumberTypeAnnotation,
  qualifiedTypeIdentifier,
  stringTypeAnnotation as babelStringTypeAnnotation,
  typeParameterInstantiation as babelTypeParameterInstantiation,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  typeAny,
  typeReference,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createFlowGenericTypeAnnotationHandler } from './flow-generic-type-annotation.handler';

const { mockNodeWithValueHandler } = testUtils;

const handler = createFlowGenericTypeAnnotationHandler(
  createHandlerFunction((_source, _config, node: BabelIdentifier) =>
    identifier(node.name)
  ),
  mockNodeWithValueHandler
).handler;

const source = '';

describe('Flow - GenericAnnotationType handler', () => {
  it('should handle generic type annotation without params', () => {
    const given = babelGenericTypeAnnotation(babelIdentifier('A'));
    const expected = typeReference(identifier('A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with empty params', () => {
    const given = babelGenericTypeAnnotation(
      babelIdentifier('A'),
      babelTypeParameterInstantiation([])
    );
    const expected = typeReference(identifier('A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with one param', () => {
    const given = babelGenericTypeAnnotation(
      babelIdentifier('A'),
      babelTypeParameterInstantiation([babelAnyTypeAnnotation()])
    );

    const expected = typeReference(identifier('A'), [
      mockNodeWithValue(babelAnyTypeAnnotation()),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle generic type annotation with multiple params', () => {
    const given = babelGenericTypeAnnotation(
      babelIdentifier('A'),
      babelTypeParameterInstantiation([
        babelAnyTypeAnnotation(),
        babelStringTypeAnnotation(),
        babelNumberTypeAnnotation(),
      ])
    );
    const expected = typeReference(identifier('A'), [
      mockNodeWithValue(babelAnyTypeAnnotation()),
      mockNodeWithValue(babelStringTypeAnnotation()),
      mockNodeWithValue(babelNumberTypeAnnotation()),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle node of type QualifiedTypeIdentifier', () => {
    const given = babelGenericTypeAnnotation(
      qualifiedTypeIdentifier(babelIdentifier('A'), babelIdentifier('B'))
    );
    const expected = typeReference(identifier('B_A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });
  it('should handle node of type QualifiedTypeIdentifier with nested QualifiedTypeIdentifiers', () => {
    const given = babelGenericTypeAnnotation(
      qualifiedTypeIdentifier(
        babelIdentifier('A'),
        qualifiedTypeIdentifier(babelIdentifier('B'), babelIdentifier('C'))
      )
    );
    const expected = typeReference(identifier('C_B_A'));

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should gracefully handle unhandled case', () => {
    const source = 'type Foo = NaN';

    const handler = createFlowGenericTypeAnnotationHandler(
      createHandlerFunction(() => unhandledExpression()),
      mockNodeWithValueHandler
    ).handler;

    const given: GenericTypeAnnotation = {
      ...babelGenericTypeAnnotation(babelIdentifier('NaN')),
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
});
