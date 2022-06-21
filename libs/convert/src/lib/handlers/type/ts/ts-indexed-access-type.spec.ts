import * as Babel from '@babel/types';
import {
  forwardHandlerFunctionRef,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  tableConstructor,
  typeAny,
  typeCastExpression,
  typeofExpression,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../../expression-statement.handler';
import { createIdentifierHandler } from '../../expression/identifier.handler';
import { createTsIndexedAccessTypeHandler } from './ts-indexed-access-type';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';

describe('TSIndexedAccessType handler', () => {
  const { handleTsTypeAnnotation, handleTsTypes } =
    createTsTypeAnnotationHandler(
      forwardHandlerRef(() => expressionHandler),
      forwardHandlerRef(() => handleIdentifier)
    );

  const handleIdentifier = createIdentifierHandler(
    forwardHandlerFunctionRef(() => handleTsTypeAnnotation.handler)
  );

  const handler = createTsIndexedAccessTypeHandler(
    forwardHandlerRef(() => handleTsTypes)
  ).handler;

  const source = '';

  it('should handle type indexed with string', () => {
    const given = Babel.tsIndexedAccessType(
      Babel.tsTypeReference(Babel.identifier('Foo')),
      Babel.tsLiteralType(Babel.stringLiteral('bar'))
    );

    const expected = typeofExpression(
      memberExpression(
        typeCastExpression(
          typeCastExpression(tableConstructor(), typeAny()),
          typeReference(identifier('Foo'))
        ),
        '.',
        identifier('bar')
      )
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle type indexed with number keyword (with added comment)', () => {
    const given = Babel.tsIndexedAccessType(
      Babel.tsTypeReference(Babel.identifier('Foo')),
      Babel.tsNumberKeyword()
    );

    const expected = withTrailingConversionComment(
      typeofExpression(
        indexExpression(
          typeCastExpression(
            typeCastExpression(tableConstructor(), typeAny()),
            typeReference(identifier('Foo'))
          ),
          numericLiteral(1)
        )
      ),
      'ROBLOX CHECK: Resulting type may differ',
      'Upstream: '
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle type indexed with type reference (with added comment)', () => {
    const given = Babel.tsIndexedAccessType(
      Babel.tsTypeReference(Babel.identifier('Foo')),
      Babel.tsTypeReference(Babel.identifier('Bar'))
    );

    const expected = withTrailingConversionComment(
      typeAny(),
      'ROBLOX FIXME: Luau types cannot be used for indexing.',
      'Upstream: '
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should handle type indexed with union', () => {
    const given = Babel.tsIndexedAccessType(
      Babel.tsTypeReference(Babel.identifier('Foo')),
      Babel.tsUnionType([
        Babel.tsLiteralType(Babel.stringLiteral('bar')),
        Babel.tsLiteralType(Babel.stringLiteral('baz')),
      ])
    );

    const expected = typeUnion([
      typeofExpression(
        memberExpression(
          typeCastExpression(
            typeCastExpression(tableConstructor(), typeAny()),
            typeReference(identifier('Foo'))
          ),
          '.',
          identifier('bar')
        )
      ),
      typeofExpression(
        memberExpression(
          typeCastExpression(
            typeCastExpression(tableConstructor(), typeAny()),
            typeReference(identifier('Foo'))
          ),
          '.',
          identifier('baz')
        )
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
