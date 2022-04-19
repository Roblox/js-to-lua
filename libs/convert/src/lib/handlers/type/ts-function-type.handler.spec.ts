import {
  identifier as babelIdentifier,
  restElement,
  tsAnyKeyword,
  tsArrayType,
  tsBooleanKeyword,
  tsFunctionType,
  tsStringKeyword,
  tsTypeAnnotation,
  tsTypeReference,
} from '@babel/types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  functionTypeParam,
  identifier,
  typeAny,
  typeBoolean,
  typeFunction,
  typeString,
  typeVariadicFunction,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createTsFunctionTypeHandler } from './ts-function-type.handler';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';

describe('TSFunctionType handler', () => {
  const { handleTsTypeAnnotation, handleTsTypes } =
    createTsTypeAnnotationHandler(
      forwardHandlerRef(() => handleExpression),
      forwardHandlerRef(() => handleIdentifier)
    );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTsTypeAnnotation.handler)
  );

  const tsFunctionTypeHandler = createTsFunctionTypeHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleTsTypes)
  ).handler;

  const source = '';

  it('should handle TSFunctionType with no parameters', () => {
    const given = tsFunctionType(null, [], tsTypeAnnotation(tsAnyKeyword()));
    const expected = typeFunction([], typeAny());

    expect(tsFunctionTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSFunctionType with parameters', () => {
    const given = tsFunctionType(
      null,
      [
        {
          ...babelIdentifier('foo'),
          typeAnnotation: tsTypeAnnotation(tsBooleanKeyword()),
        },
      ],
      tsTypeAnnotation(tsAnyKeyword())
    );
    const expected = typeFunction(
      [functionTypeParam(identifier('foo'), typeBoolean())],
      typeAny()
    );

    expect(tsFunctionTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSFunctionType with parameters and rest element (known element type)', () => {
    const given = tsFunctionType(
      null,
      [
        {
          ...babelIdentifier('foo'),
          typeAnnotation: tsTypeAnnotation(tsBooleanKeyword()),
        },
        {
          ...restElement(babelIdentifier('args')),
          typeAnnotation: tsTypeAnnotation(tsArrayType(tsStringKeyword())),
        },
      ],
      tsTypeAnnotation(tsAnyKeyword())
    );
    const expected = typeVariadicFunction(
      [functionTypeParam(identifier('foo'), typeBoolean())],
      typeString(),
      typeAny()
    );

    expect(tsFunctionTypeHandler(source, {}, given)).toEqual(expected);
  });

  it('should handle TSFunctionType with parameters and rest element (unknown element type)', () => {
    const source = 'Args';
    const given = tsFunctionType(
      null,
      [
        {
          ...babelIdentifier('foo'),
          typeAnnotation: tsTypeAnnotation(tsBooleanKeyword()),
        },
        {
          ...restElement(babelIdentifier('args')),
          typeAnnotation: {
            ...tsTypeAnnotation(tsTypeReference(babelIdentifier('Args'))),
            start: 0,
            end: source.length,
          },
        },
      ],
      tsTypeAnnotation(tsAnyKeyword())
    );
    const expected = typeVariadicFunction(
      [functionTypeParam(identifier('foo'), typeBoolean())],
      withTrailingConversionComment(
        typeAny(),
        'ROBLOX CHECK: check correct type of elements. Upstream type: <Args>'
      ),
      typeAny()
    );

    expect(tsFunctionTypeHandler(source, {}, given)).toEqual(expected);
  });
});
