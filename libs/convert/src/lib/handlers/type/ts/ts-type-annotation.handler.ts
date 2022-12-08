import { Expression, TSType, TSTypeAnnotation } from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultTypeHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaType,
  LuaTypeAnnotation,
  typeAnnotation,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsAnyKeywordHandler } from './ts-any-keyword.handler';
import { createTsArrayTypeHandler } from './ts-array-type.handler';
import { createTsBooleanKeywordHandler } from './ts-boolean-keyword.handler';
import { createTsFunctionTypeHandler } from './ts-function-type.handler';
import { createTsIndexedAccessTypeHandler } from './ts-indexed-access-type';
import { createTsLiteralTypeHandler } from './ts-literal-type.handler';
import { createTsNeverKeywordHandler } from './ts-never-keyword.handler';
import { createTsNullKeywordHandler } from './ts-null-keyword.handler';
import { createTsNumberKeywordHandler } from './ts-number-keyword.handler';
import { createTsObjectKeywordHandler } from './ts-object-keyword.handler';
import { createTsParenthesizedTypeHandler } from './ts-parenthesized-type.handler';
import { createTsQualifiedNameHandler } from './ts-qualified-name.handler';
import { createTsStringKeywordHandler } from './ts-string-keyword.handler';
import { createTsTupleTypeHandler } from './ts-tuple-type.handler';
import { createTsTypeIntersectionHandler } from './ts-type-intersection.handler';
import { createTsTypeLiteralHandler } from './ts-type-literal.handler';
import { createTsTypePredicateHandler } from './ts-type-predicate.handler';
import { createTsTypeQueryHandler } from './ts-type-query.handler';
import { createTsTypeReferenceHandler } from './ts-type-reference-handler';
import { createTsTypeUnionHandler } from './ts-type-union.handler';
import { createTsUndefinedKeywordHandler } from './ts-undefined-keyword.handler';
import { createTsUnknownKeywordHandler } from './ts-unknown-keyword.handler';
import { createTsVoidKeywordHandler } from './ts-void-keyword.handler';

export const createTsTypeAnnotationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  const handleTsTypeAnnotation = createHandler<
    LuaTypeAnnotation,
    TSTypeAnnotation
  >('TSTypeAnnotation', (source, config, node) =>
    typeAnnotation(handleTsTypes.handler(source, config, node.typeAnnotation))
  );

  const forwardedHandleTsType = forwardHandlerRef(() => handleTsTypes);
  const handleTsTypes: BaseNodeHandler<LuaType, TSType> = combineHandlers<
    LuaType,
    TSType
  >(
    [
      createTsStringKeywordHandler(),
      createTsNumberKeywordHandler(),
      createTsBooleanKeywordHandler(),
      createTsVoidKeywordHandler(),
      createTsAnyKeywordHandler(),
      createTsUndefinedKeywordHandler(),
      createTsUnknownKeywordHandler(),
      createTsNeverKeywordHandler(),
      createTsNullKeywordHandler(),
      createTsObjectKeywordHandler(),
      createTsTypeQueryHandler(handleIdentifierStrict),
      createTsTypePredicateHandler(),
      createTsTypeLiteralHandler(
        handleIdentifierStrict,
        handleExpression,
        handleTsTypeAnnotation.handler,
        forwardedHandleTsType
      ),
      createTsTypeUnionHandler(forwardedHandleTsType),
      createTsTypeIntersectionHandler(forwardedHandleTsType),
      createTsTypeReferenceHandler(
        handleIdentifierStrict,
        createTsQualifiedNameHandler(),
        forwardedHandleTsType
      ),
      createTsArrayTypeHandler(forwardedHandleTsType),
      createTsTupleTypeHandler(forwardedHandleTsType),
      createTsFunctionTypeHandler(
        handleIdentifierStrict,
        forwardedHandleTsType
      ),
      createTsLiteralTypeHandler(handleExpression),
      createTsIndexedAccessTypeHandler(forwardedHandleTsType),
      createTsParenthesizedTypeHandler(forwardedHandleTsType),
    ],
    defaultTypeHandler
  );
  return { handleTsTypes, handleTsTypeAnnotation };
};
