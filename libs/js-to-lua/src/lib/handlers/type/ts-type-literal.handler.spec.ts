import {
  identifier as babelIdentifier,
  tsAnyKeyword,
  tsBooleanKeyword,
  tsIndexSignature,
  tsNumberKeyword,
  tsPropertySignature,
  tsStringKeyword,
  tsTypeAnnotation,
  tsTypeLiteral,
} from '@babel/types';
import {
  identifier,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIndexSignature,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typePropertySignature,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '../../utils/forward-handler-ref';
import { handleExpression } from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createTsTypeLiteralHandler } from './ts-type-literal.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';

describe('TSIndesSignature handler', () => {
  const { typesHandler } = createTypeAnnotationHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => typesHandler)
  );

  const tsTypeLiteralHandler = createTsTypeLiteralHandler(
    forwardHandlerRef(() => handleExpression),
    typesHandler
  );
  const source = '';

  it('should handle more than one indexSignature and a property signature', () => {
    const given = tsTypeLiteral([
      tsIndexSignature(
        [
          {
            ...babelIdentifier('foo'),
            typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
          },
        ],
        tsTypeAnnotation(tsAnyKeyword())
      ),
      tsIndexSignature(
        [
          {
            ...babelIdentifier('bar'),
            typeAnnotation: tsTypeAnnotation(tsNumberKeyword()),
          },
        ],
        tsTypeAnnotation(tsStringKeyword())
      ),
      tsPropertySignature(
        babelIdentifier('baz'),
        tsTypeAnnotation(tsBooleanKeyword())
      ),
    ]);

    const expected = typeIntersection([
      typeUnion([
        typeLiteral([
          typeIndexSignature(typeString(), typeAnnotation(typeAny())),
        ]),
        typeLiteral([
          typeIndexSignature(typeNumber(), typeAnnotation(typeString())),
        ]),
      ]),
      typeLiteral([
        typePropertySignature(identifier('baz'), typeAnnotation(typeBoolean())),
      ]),
    ]);

    expect(tsTypeLiteralHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should handle more than one indexSignature and no property signatures', () => {
    const given = tsTypeLiteral([
      tsIndexSignature(
        [
          {
            ...babelIdentifier('foo'),
            typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
          },
        ],
        tsTypeAnnotation(tsAnyKeyword())
      ),
      tsIndexSignature(
        [
          {
            ...babelIdentifier('bar'),
            typeAnnotation: tsTypeAnnotation(tsNumberKeyword()),
          },
        ],
        tsTypeAnnotation(tsStringKeyword())
      ),
    ]);

    const expected = typeUnion([
      typeLiteral([
        typeIndexSignature(typeString(), typeAnnotation(typeAny())),
      ]),
      typeLiteral([
        typeIndexSignature(typeNumber(), typeAnnotation(typeString())),
      ]),
    ]);

    expect(tsTypeLiteralHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should handle single indexSignature and no property signatures', () => {
    const given = tsTypeLiteral([
      tsIndexSignature(
        [
          {
            ...babelIdentifier('foo'),
            typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
          },
        ],
        tsTypeAnnotation(tsAnyKeyword())
      ),
    ]);

    const expected = typeLiteral([
      typeIndexSignature(typeString(), typeAnnotation(typeAny())),
    ]);

    expect(tsTypeLiteralHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should handle property signatures', () => {
    const given = tsTypeLiteral([
      tsPropertySignature(
        babelIdentifier('baz'),
        tsTypeAnnotation(tsBooleanKeyword())
      ),
    ]);

    const expected = typeLiteral([
      typePropertySignature(identifier('baz'), typeAnnotation(typeBoolean())),
    ]);

    expect(tsTypeLiteralHandler.handler(source, {}, given)).toEqual(expected);
  });
});
