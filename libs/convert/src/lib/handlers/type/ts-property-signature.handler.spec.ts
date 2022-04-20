import {
  binaryExpression as babelBinaryExpression,
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  tsPropertySignature,
  tsStringKeyword,
  tsTypeAnnotation,
} from '@babel/types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  stringLiteral,
  typeAnnotation,
  typePropertySignature,
  typeString,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createTsPropertySignatureHandler } from './ts-property-signature.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';

describe('TSIndesSignature handler', () => {
  const { handleTypeAnnotation } = createTypeAnnotationHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTypeAnnotation)
  );

  const propertySignatureHandler = createTsPropertySignatureHandler(
    forwardHandlerRef(() => handleExpression),
    handleTypeAnnotation
  );
  const source = '';

  it('should handle TSPropertySignature when key is an identifier', () => {
    const given = tsPropertySignature(
      babelIdentifier('foo'),
      tsTypeAnnotation(tsStringKeyword())
    );
    const expected = typePropertySignature(
      identifier('foo'),
      typeAnnotation(typeString())
    );

    expect(propertySignatureHandler.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it('should handle TSPropertySignature when key is a string literal', () => {
    const given = tsPropertySignature(
      babelStringLiteral('foo'),
      tsTypeAnnotation(tsStringKeyword())
    );
    const expected = typePropertySignature(
      stringLiteral('foo'),
      typeAnnotation(typeString())
    );

    expect(propertySignatureHandler.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it('should default to {[string]:<Type>} with a message key is not an identifier', () => {
    const source = '[a*b]';
    const given = tsPropertySignature(
      {
        ...babelBinaryExpression(
          '*',
          babelIdentifier('foo'),
          babelIdentifier('bar')
        ),
        start: 0,
        end: source.length,
      },
      tsTypeAnnotation(tsStringKeyword())
    );
    const expected = typePropertySignature(
      withTrailingConversionComment(
        typeString(),
        `ROBLOX TODO: unhandled node for type: TSPropertySignature with key of type BinaryExpression`,
        source
      ),
      typeAnnotation(typeString())
    );

    expect(propertySignatureHandler.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
