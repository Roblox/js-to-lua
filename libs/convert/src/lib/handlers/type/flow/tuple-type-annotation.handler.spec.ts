import {
  genericTypeAnnotation,
  identifier as babelIdentifier,
  numberTypeAnnotation,
  stringTypeAnnotation,
  tupleTypeAnnotation,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  identifier,
  typeLiteral,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTupleTypeAnnotationHandler } from './tuple-type-annotation.handler';

describe('TupleTypeAnnotation handler', () => {
  const tupleTypeAnnotationHandler = createTupleTypeAnnotationHandler(
    testUtils.mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should handle TupleTypeAnnotation with a single type param', () => {
    const given = tupleTypeAnnotation([
      genericTypeAnnotation(babelIdentifier('Foo')),
    ]);
    const expected = typeReference(identifier('Array'), [
      mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Foo'))),
    ]);

    expect(tupleTypeAnnotationHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle empty TupleTypeAnnotation', () => {
    const given = tupleTypeAnnotation([]);
    const expected = typeLiteral([]);

    expect(tupleTypeAnnotationHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TupleTypeAnnotation with a two type param', () => {
    const given = tupleTypeAnnotation([
      numberTypeAnnotation(),
      stringTypeAnnotation(),
    ]);
    const expected = typeReference(identifier('Array'), [
      typeUnion([
        mockNodeWithValue(numberTypeAnnotation()),
        mockNodeWithValue(stringTypeAnnotation()),
      ]),
    ]);

    expect(tupleTypeAnnotationHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TupleTypeAnnotation with a multiple type param', () => {
    const given = tupleTypeAnnotation([
      numberTypeAnnotation(),
      stringTypeAnnotation(),
      genericTypeAnnotation(babelIdentifier('Foo')),
    ]);
    const expected = typeReference(identifier('Array'), [
      typeUnion([
        mockNodeWithValue(numberTypeAnnotation()),
        mockNodeWithValue(stringTypeAnnotation()),
        mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Foo'))),
      ]),
    ]);

    expect(tupleTypeAnnotationHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TupleTypeAnnotation with a duplicate type param', () => {
    const given = tupleTypeAnnotation([
      numberTypeAnnotation(),
      numberTypeAnnotation(),
      stringTypeAnnotation(),
      genericTypeAnnotation(babelIdentifier('Foo')),
      stringTypeAnnotation(),
      stringTypeAnnotation(),
      numberTypeAnnotation(),
      genericTypeAnnotation(babelIdentifier('Foo')),
      genericTypeAnnotation(babelIdentifier('Bar')),
      genericTypeAnnotation(babelIdentifier('Foo')),
      genericTypeAnnotation(babelIdentifier('Foo')),
    ]);
    const expected = typeReference(identifier('Array'), [
      typeUnion([
        mockNodeWithValue(numberTypeAnnotation()),
        mockNodeWithValue(stringTypeAnnotation()),
        mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Foo'))),
        mockNodeWithValue(genericTypeAnnotation(babelIdentifier('Bar'))),
      ]),
    ]);

    expect(tupleTypeAnnotationHandler(source, {}, given)).toEqual(expected);
  });
});
