import {
  identifier as babelIdentifier,
  tsBooleanKeyword,
  tsIndexSignature,
  tsNumberKeyword,
  tsStringKeyword,
  tsTypeAnnotation,
} from '@babel/types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  typeAnnotation,
  typeAny,
  typeIndexSignature,
  typeNumber,
  typeString,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../../expression-statement.handler';
import { createIdentifierHandler } from '../../expression/identifier.handler';
import { createTypeAnnotationHandler } from '../type-annotation.handler';
import { createTsIndexSignatureHandler } from './ts-index-signature.handler';

describe('TSIndesSignature handler', () => {
  const { handleTypeAnnotation } = createTypeAnnotationHandler(
    forwardHandlerRef(() => expressionHandler),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTypeAnnotation)
  );

  const indexSignatureHandler =
    createTsIndexSignatureHandler(handleTypeAnnotation);
  const source = '';

  it('should handle Valid TSIndexSignature', () => {
    const given = tsIndexSignature(
      [
        {
          ...babelIdentifier('foo'),
          typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
        },
      ],
      tsTypeAnnotation(tsNumberKeyword())
    );
    const expected = typeIndexSignature(
      typeString(),
      typeAnnotation(typeNumber())
    );

    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should default to {[string]:any} with a message if there are no parameters', () => {
    const source = 'Invalid Index Signature';
    const given = {
      ...tsIndexSignature([], tsTypeAnnotation(tsNumberKeyword())),
      start: 0,
      end: source.length,
    };

    const expected = withTrailingConversionComment(
      typeIndexSignature(typeString(), typeAnnotation(typeAny())),
      'Multiple or no parameters are not handled for TSIndexSignature',
      source
    );
    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should default to {[string]:any} with a message if there is more than one parameter', () => {
    const source = 'Invalid Index Signature';
    const given = {
      ...tsIndexSignature(
        [
          {
            ...babelIdentifier('foo'),
            typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
          },
          {
            ...babelIdentifier('bar'),
            typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
          },
        ],
        tsTypeAnnotation(tsNumberKeyword())
      ),
      start: 0,
      end: source.length,
    };

    const expected = withTrailingConversionComment(
      typeIndexSignature(typeString(), typeAnnotation(typeAny())),
      'Multiple or no parameters are not handled for TSIndexSignature',
      source
    );
    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should default to {[string]:any} with a message if parameter has no typeAnnotation', () => {
    const source = 'Invalid Index Signature';
    const given = {
      ...tsIndexSignature(
        [babelIdentifier('foo')],
        tsTypeAnnotation(tsNumberKeyword())
      ),
      start: 0,
      end: source.length,
    };

    const expected = withTrailingConversionComment(
      typeIndexSignature(typeString(), typeAnnotation(typeAny())),
      'Node parameter typeAnnotation is required for TSIndexSignature',
      source
    );
    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should default to {[string]:any} with a message if index signature has no typeAnnotation', () => {
    const source = 'Invalid Index Signature';
    const given = {
      ...tsIndexSignature([
        {
          ...babelIdentifier('foo'),
          typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
        },
      ]),
      start: 0,
      end: source.length,
    };

    const expected = withTrailingConversionComment(
      typeIndexSignature(typeString(), typeAnnotation(typeAny())),
      'TSIndexSignature typeAnnotation is required',
      source
    );
    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });

  it('should return to {[string]:<Type>} with a message if parameter type is not a string or number', () => {
    const source = 'Invalid Index Signature';
    const given = {
      ...tsIndexSignature(
        [
          {
            ...babelIdentifier('foo'),
            typeAnnotation: tsTypeAnnotation(tsBooleanKeyword()),
            start: 0,
            end: source.length,
          },
        ],
        tsTypeAnnotation(tsNumberKeyword())
      ),
    };

    const expected = typeIndexSignature(
      withTrailingConversionComment(
        typeString(),
        'TSIndexSignature parameter type must be string or number.',
        source
      ),
      typeAnnotation(typeNumber())
    );
    expect(indexSignatureHandler.handler(source, {}, given)).toEqual(expected);
  });
});
