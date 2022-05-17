import { tsTypeParameter, tsTypeParameterDeclaration } from '@babel/types';
import { forwardHandlerFunctionRef } from '@js-to-lua/handler-utils';
import {
  identifier,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../../expression-statement.handler';
import { createIdentifierHandler } from '../../expression/identifier.handler';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';
import { createTsTypeParameterDeclarationHandler } from './ts-type-parameter-declaration.handler';

describe('TSTypeParameterDeclaration handler', () => {
  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTsTypeAnnotation.handler)
  );
  const { handleTsTypes, handleTsTypeAnnotation } =
    createTsTypeAnnotationHandler(
      expressionHandler.handler,
      handleIdentifier.handler
    );
  const handleTsTypeParameterDeclaration =
    createTsTypeParameterDeclarationHandler(handleTsTypes.handler).handler;

  const source = '';

  it('should handle single parameter', () => {
    const given = tsTypeParameterDeclaration([
      tsTypeParameter(undefined, undefined, 'T'),
    ]);

    const expected = typeParameterDeclaration([typeReference(identifier('T'))]);

    expect(handleTsTypeParameterDeclaration(source, {}, given)).toEqual(
      expected
    );
  });
  it('should handle multiple parameters', () => {
    const given = tsTypeParameterDeclaration([
      tsTypeParameter(undefined, undefined, 'T'),
      tsTypeParameter(undefined, undefined, 'U'),
    ]);

    const expected = typeParameterDeclaration([
      typeReference(identifier('T')),
      typeReference(identifier('U')),
    ]);

    expect(handleTsTypeParameterDeclaration(source, {}, given)).toEqual(
      expected
    );
  });
});
