import * as Babel from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  functionParamName,
  functionReturnType,
  functionTypeParamEllipse,
  identifier,
  typeAnnotation,
  typeAny,
  typeFunction,
  typeNumber,
  typePropertySignature,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';

import {
  expressionHandler,
  handleType,
} from '../../expression-statement.handler';
import { createIdentifierHandler } from '../../expression/identifier.handler';
import { createTypeAnnotationHandler } from '../type-annotation.handler';
import { createTsMethodSignatureHandler } from './ts-method-signature.handler';

describe('TSMethodSignature handler', () => {
  const { handleTypeAnnotation } = createTypeAnnotationHandler(
    forwardHandlerRef(() => expressionHandler),
    forwardHandlerRef(() => handleIdentifier)
  );

  const handleIdentifier = createIdentifierHandler(handleTypeAnnotation);

  const source = '';
  const methodSignatureHandler = createTsMethodSignatureHandler(
    forwardHandlerRef(() => handleIdentifier),
    forwardHandlerRef(() => expressionHandler),
    handleType.handler
  ).handler;

  it.each(['MyInterface', 'AnotherInterface', 'YetAnotherInterface'])(
    `Interface '%s' should handle TSMethodSignature when method signature has no params while adding correct type to self `,
    (interfaceName) => {
      const given = Babel.tsMethodSignature(
        Babel.identifier('foo'),
        null,
        [],
        Babel.tsTypeAnnotation(Babel.tsVoidKeyword())
      );

      const expected = typePropertySignature(
        identifier('foo'),
        typeAnnotation(
          typeFunction(
            [
              functionParamName(
                identifier('self'),
                typeReference(identifier(interfaceName))
              ),
            ],
            functionReturnType([])
          )
        )
      );

      expect(
        methodSignatureHandler(
          source,
          { typeId: identifier(interfaceName) },
          given
        )
      ).toEqual(expected);
    }
  );

  it(`Interface '%s' should handle TSMethodSignature when it receives an unhandled node as a key`, () => {
    const given = Babel.tsMethodSignature(
      Babel.binaryExpression(
        '*',
        Babel.identifier('foo'),
        Babel.identifier('bar')
      ),
      null,
      [],
      Babel.tsTypeAnnotation(Babel.tsVoidKeyword())
    );

    const expected = typePropertySignature(
      withTrailingConversionComment(
        typeString(),
        `ROBLOX TODO: unhandled node for type: TSMethodSignature with key of type BinaryExpression`,
        source
      ),
      typeAnnotation(
        typeFunction(
          [
            functionParamName(
              identifier('self'),
              typeReference(identifier('MyInterface'))
            ),
          ],
          functionReturnType([])
        )
      )
    );

    expect(
      methodSignatureHandler(
        source,
        { typeId: identifier('MyInterface') },
        given
      )
    ).toEqual(expected);
  });

  it.each([
    { babelType: Babel.tsVoidKeyword(), luaTypes: [] },
    {
      babelType: Babel.tsStringKeyword(),
      luaTypes: [typeString()],
    },
    {
      babelType: Babel.tsNumberKeyword(),
      luaTypes: [typeNumber()],
    },
    {
      babelType: Babel.tsAnyKeyword(),
      luaTypes: [typeAny()],
    },
  ])(
    `Interface '%s' should handle TSMethodSignature with proper method return types`,
    (returnType) => {
      const given = Babel.tsMethodSignature(
        Babel.identifier('foo'),
        null,
        [],
        Babel.tsTypeAnnotation(returnType.babelType)
      );

      const expected = typePropertySignature(
        identifier('foo'),
        typeAnnotation(
          typeFunction(
            [
              functionParamName(
                identifier('self'),
                typeReference(identifier('MyInterface'))
              ),
            ],
            functionReturnType(returnType.luaTypes)
          )
        )
      );

      expect(
        methodSignatureHandler(
          source,
          { typeId: identifier('MyInterface') },
          given
        )
      ).toEqual(expected);
    }
  );

  it.each(['MyInterface', 'AnotherInterface', 'YetAnotherInterface'])(
    `Interface '%s' should handle TSMethodSignature when method signature has params that are function params`,
    (interfaceName) => {
      const identifier1 = Babel.identifier('bar');
      identifier1.typeAnnotation = Babel.tsTypeAnnotation(
        Babel.tsStringKeyword()
      );
      const identifier2 = Babel.identifier('fizz');
      identifier2.typeAnnotation = Babel.tsTypeAnnotation(
        Babel.tsNumberKeyword()
      );

      const given = Babel.tsMethodSignature(
        Babel.identifier('foo'),
        null,
        [identifier1, identifier2],
        Babel.tsTypeAnnotation(Babel.tsVoidKeyword())
      );

      const expected = typePropertySignature(
        identifier('foo'),
        typeAnnotation(
          typeFunction(
            [
              functionParamName(
                identifier('self'),
                typeReference(identifier(interfaceName))
              ),
              functionParamName(identifier('bar'), typeString()),
              functionParamName(identifier('fizz'), typeNumber()),
            ],
            functionReturnType([])
          )
        )
      );

      expect(
        methodSignatureHandler(
          source,
          { typeId: identifier(interfaceName) },
          given
        )
      ).toEqual(expected);
    }
  );

  it.each(['MyInterface', 'AnotherInterface', 'YetAnotherInterface'])(
    `Interface '%s' should handle TSMethodSignature when method signature has a param that is a rest element`,
    (interfaceName) => {
      const identifier1 = Babel.identifier('bar');
      identifier1.typeAnnotation = Babel.tsTypeAnnotation(
        Babel.tsStringKeyword()
      );
      const identifier2 = Babel.restElement(Babel.identifier('buzz'));
      identifier2.typeAnnotation = Babel.tsTypeAnnotation(
        Babel.tsArrayType(Babel.tsNumberKeyword())
      );

      const given = Babel.tsMethodSignature(
        Babel.identifier('foo'),
        null,
        [identifier1, identifier2],
        Babel.tsTypeAnnotation(Babel.tsVoidKeyword())
      );

      const expected = typePropertySignature(
        identifier('foo'),
        typeAnnotation(
          typeFunction(
            [
              functionParamName(
                identifier('self'),
                typeReference(identifier(interfaceName))
              ),
              functionParamName(identifier('bar'), typeString()),
              functionTypeParamEllipse(typeNumber()),
            ],

            functionReturnType([])
          )
        )
      );

      expect(
        methodSignatureHandler(
          source,
          { typeId: identifier(interfaceName) },
          given
        )
      ).toEqual(expected);
    }
  );
});
