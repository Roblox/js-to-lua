import {
  identifier as babelIdentifier,
  restElement,
  tsAnyKeyword,
  tsArrayType,
  tsBooleanKeyword,
  tsFunctionType,
  tsStringKeyword,
  tsTypeAnnotation,
  tsTypeParameter,
  tsTypeParameterDeclaration,
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
  typeParameterDeclaration,
  typeReference,
  typeString,
  typeVariadicFunction,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createTsFunctionTypeHandler } from './ts-function-type.handler';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';

describe('TSFunctionType handler', () => {
  const { handleTsTypeAnnotation, handleTsTypes } =
    createTsTypeAnnotationHandler(
      forwardHandlerRef(() => expressionHandler),
      forwardHandlerRef(() => handleIdentifier)
    );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTsTypeAnnotation.handler)
  );

  const tsFunctionTypeHandler = createTsFunctionTypeHandler(
    forwardHandlerRef(() => expressionHandler),
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

  it('should handle TSTypeDeclaration type parameters', () => {
    const given = tsFunctionType(
      tsTypeParameterDeclaration([
        tsTypeParameter(undefined, undefined, 'T'),
        tsTypeParameter(undefined, undefined, 'U'),
      ]),
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
      typeAny(),
      typeParameterDeclaration([
        typeReference(identifier('T')),
        typeReference(identifier('U')),
      ])
    );

    expect(tsFunctionTypeHandler(source, {}, given)).toEqual(expected);
  });
});
