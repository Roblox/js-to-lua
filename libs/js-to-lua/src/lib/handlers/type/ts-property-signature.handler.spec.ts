import {
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  tsPropertySignature,
  tsStringKeyword,
  tsTypeAnnotation,
} from '@babel/types';
import {
  identifier,
  typeAnnotation,
  typePropertySignature,
  typeString,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '../../utils/forward-handler-ref';
import { handleExpression } from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createTsPropertySignatureHandler } from './ts-property-signature.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';

describe('TSIndesSignature handler', () => {
  const { typesHandler } = createTypeAnnotationHandler(
    forwardHandlerRef(() => handleExpression),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => typesHandler)
  );

  const propertySignatureHandler = createTsPropertySignatureHandler(
    forwardHandlerRef(() => handleExpression),
    typesHandler
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

  it('should default to {[string]:<Type>} with a message key is not an identifier', () => {
    const source = 'unhandled_key_type';
    const given = tsPropertySignature(
      { ...babelStringLiteral('foo'), start: 0, end: source.length },
      tsTypeAnnotation(tsStringKeyword())
    );
    const expected = typePropertySignature(
      withTrailingConversionComment(
        typeString(),
        `ROBLOX TODO: unhandled node for type: TSPropertySignature with key of type StringLiteral`,
        source
      ),
      typeAnnotation(typeString())
    );

    expect(propertySignatureHandler.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
