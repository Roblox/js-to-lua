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
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIndexSignature,
  typeIntersection,
  typeLiteral,
  typeNil,
  typeNumber,
  typePropertySignature,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import {
  expressionHandler,
  handleType,
} from '../../expression-statement.handler';
import { createIdentifierHandler } from '../../expression/identifier.handler';
import { createTypeAnnotationHandler } from '../type-annotation.handler';
import { createTsTypeLiteralHandler } from './ts-type-literal.handler';

describe('TSIndexSignature handler', () => {
  const { handleTypeAnnotation } = createTypeAnnotationHandler(
    forwardHandlerRef(() => expressionHandler),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTypeAnnotation)
  );

  const tsTypeLiteralHandler = createTsTypeLiteralHandler(
    forwardHandlerRef(() => handleIdentifier),
    forwardHandlerRef(() => expressionHandler),
    handleTypeAnnotation,
    handleType.handler
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

  it('should handle unhandled node in type literal', () => {
    const given = tsTypeLiteral([]);
    // have to add to members manually as tsTypeLiteral function checks if members are correct
    given.members.push(
      // @ts-expect-error bamboozle TS into allowing this
      { type: 'UnhandledTSNode' }
    );

    const expected = typeLiteral([
      withTrailingConversionComment(
        typePropertySignature(
          identifier('__unhandledIdentifier__'),
          typeAnnotation(typeNil())
        ),
        'ROBLOX TODO: Unhandled node for type: UnhandledTSNode'
      ),
    ]);

    expect(tsTypeLiteralHandler.handler(source, {}, given)).toEqual(expected);
  });
});
