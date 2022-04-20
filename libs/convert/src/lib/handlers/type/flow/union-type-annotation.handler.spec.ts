import {
  anyTypeAnnotation,
  FlowType,
  isAnyTypeAnnotation,
  isNumberLiteralTypeAnnotation,
  isNumberTypeAnnotation,
  isStringTypeAnnotation,
  numberLiteralTypeAnnotation,
  numberTypeAnnotation,
  stringTypeAnnotation,
  unionTypeAnnotation as babelUnionTypeAnnotation,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  LuaType,
  typeAny,
  typeNumber,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { createUnionTypeAnnotationHandler } from './union-type-annotation.handler';

const {
  mockNodeWithValueHandler,
  withBabelComments,
  withLuaComments,
  withComments,
} = testUtils;

describe('Flow - UnionTypeAnnotation handler', () => {
  const { handler } = createUnionTypeAnnotationHandler(
    createHandlerFunction<LuaType, FlowType>((source, config, node) => {
      if (isAnyTypeAnnotation(node)) {
        return typeAny();
      } else if (
        isNumberTypeAnnotation(node) ||
        isNumberLiteralTypeAnnotation(node)
      ) {
        return typeNumber();
      } else if (isStringTypeAnnotation(node)) {
        return typeString();
      } else {
        return mockNodeWithValueHandler(source, config, node);
      }
    })
  );

  const source = '';

  it('should handle simple union', () => {
    const given = babelUnionTypeAnnotation([
      anyTypeAnnotation(),
      stringTypeAnnotation(),
    ]);
    const expected = typeUnion([typeAny(), typeString()]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle deduplicate multiple number type annotations', () => {
    const given = babelUnionTypeAnnotation([
      numberLiteralTypeAnnotation(0),
      anyTypeAnnotation(),
      stringTypeAnnotation(),
      numberTypeAnnotation(),
      numberLiteralTypeAnnotation(1),
    ]);
    const expected = typeUnion([typeNumber(), typeAny(), typeString()]);

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const { given, expected } = withComments(
      babelUnionTypeAnnotation([anyTypeAnnotation(), stringTypeAnnotation()]),
      typeUnion([typeAny(), typeString()])
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments on all unioned types', () => {
    const { given, expected } = withComments(
      babelUnionTypeAnnotation([
        withBabelComments(numberLiteralTypeAnnotation(1), 'FIRST'),
        withBabelComments(numberLiteralTypeAnnotation(2), 'SECOND'),
        stringTypeAnnotation(),
        withBabelComments(numberLiteralTypeAnnotation(3), 'THIRD'),
        withBabelComments(numberTypeAnnotation(), 'FOURTH'),
      ]),
      typeUnion([
        withLuaComments(
          withLuaComments(
            withLuaComments(withLuaComments(typeNumber(), 'FIRST'), 'SECOND'),
            'THIRD'
          ),
          'FOURTH'
        ),
        typeString(),
      ]),
      'OUTER'
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
