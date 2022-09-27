import {
  Expression,
  isIdentifier as isBabelIdentifier,
  isNumericLiteral,
  isTSLiteralType,
  isTSNumberKeyword,
  TSAnyKeyword,
  TSBooleanKeyword,
  TSIntersectionType,
  TSNullKeyword,
  TSNumberKeyword,
  TSStringKeyword,
  TSType,
  TSTypeAnnotation,
  TSTypePredicate,
  TSTypeQuery,
  TSUndefinedKeyword,
  TSUnionType,
  TSUnknownKeyword,
  TSVoidKeyword,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultTypeHandler,
  defaultUnhandledIdentifierHandler,
  getNodeSource,
  withTrailingConversionComment,
  withVoidTypePolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeBoolean,
  LuaTypeIntersection,
  LuaTypeNumber,
  LuaTypeString,
  LuaTypeUnion,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIntersection,
  typeNil,
  typeNumber,
  typeQuery,
  typeReference,
  typeString,
  typeUnion,
} from '@js-to-lua/lua-types';
import { uniqWith } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsArrayTypeHandler } from './ts-array-type.handler';
import { createTsFunctionTypeHandler } from './ts-function-type.handler';
import { createTsIndexedAccessTypeHandler } from './ts-indexed-access-type';
import { createTsLiteralTypeHandler } from './ts-literal-type.handler';
import { createTsQualifiedNameHandler } from './ts-qualified-name.handler';
import { createTsTupleTypeHandler } from './ts-tuple-type.handler';
import { createTsTypeLiteralHandler } from './ts-type-literal.handler';
import { createTsTypeReferenceHandler } from './ts-type-reference-handler';

export const createTsTypeAnnotationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  const handleTsTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TSTypeAnnotation
  > = createHandler('TSTypeAnnotation', (source, config, node) =>
    typeAnnotation(handleTsTypes.handler(source, config, node.typeAnnotation))
  );

  const handleTsAnyKeyword: BaseNodeHandler<LuaTypeAny, TSAnyKeyword> =
    createHandler('TSAnyKeyword', () => typeAny());

  const handleTsStringKeyword: BaseNodeHandler<LuaTypeString, TSStringKeyword> =
    createHandler('TSStringKeyword', () => typeString());

  const handleTsNumberKeyword: BaseNodeHandler<LuaTypeNumber, TSNumberKeyword> =
    createHandler('TSNumberKeyword', () => typeNumber());

  const handleTsUndefinedKeyword: BaseNodeHandler<LuaType, TSUndefinedKeyword> =
    createHandler('TSUndefinedKeyword', () => typeNil());

  const handleTsUnknownKeyword: BaseNodeHandler<LuaType, TSUnknownKeyword> =
    createHandler('TSUnknownKeyword', () =>
      typeReference(identifier('unknown'))
    );

  const handleTsNullKeyword: BaseNodeHandler<LuaType, TSNullKeyword> =
    createHandler('TSNullKeyword', () =>
      withTrailingConversionComment(
        typeNil(),
        "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
      )
    );

  const handleTsTypeQuery: BaseNodeHandler<LuaType, TSTypeQuery> =
    createHandler('TSTypeQuery', (source, config, node) => {
      const exprName = node.exprName;
      return typeQuery(
        isBabelIdentifier(exprName)
          ? handleIdentifierStrict(source, config, exprName)
          : defaultUnhandledIdentifierHandler(source, config, exprName)
      );
    });

  const handleTsTypePredicate: BaseNodeHandler<LuaType, TSTypePredicate> =
    createHandler('TSTypePredicate', (source, config, node) =>
      withTrailingConversionComment(
        typeBoolean(),
        'ROBLOX FIXME: change to TSTypePredicate equivalent if supported',
        getNodeSource(source, node)
      )
    );

  const handleTsBooleanKeyword = createHandler<
    LuaTypeBoolean,
    TSBooleanKeyword
  >('TSBooleanKeyword', () => typeBoolean());

  const handleTsVoidKeyword = createHandler<LuaType, TSVoidKeyword>(
    'TSVoidKeyword',
    () => withVoidTypePolyfillExtra(typeReference(identifier('void')))
  );

  const handleTsTypeUnion: BaseNodeHandler<LuaTypeUnion, TSUnionType> =
    createHandler('TSUnionType', (source, config, node) => {
      const isNumericLiteralOrNumber = (node: TSType) =>
        (isTSLiteralType(node) && isNumericLiteral(node.literal)) ||
        isTSNumberKeyword(node);

      return typeUnion(
        uniqWith(
          (a, b) => isNumericLiteralOrNumber(a) && isNumericLiteralOrNumber(b),
          node.types
        ).map((x) =>
          isNumericLiteralOrNumber(x)
            ? typeNumber()
            : handleTsTypes.handler(source, config, x)
        )
      );
    });

  const handleTsTypeIntersection: BaseNodeHandler<
    LuaTypeIntersection,
    TSIntersectionType
  > = createHandler('TSIntersectionType', (source, config, node) =>
    typeIntersection(node.types.map(handleTsTypes.handler(source, config)))
  );

  const handleTsTypes: BaseNodeHandler<LuaType, TSType> = combineHandlers<
    LuaType,
    TSType
  >(
    [
      handleTsStringKeyword,
      handleTsNumberKeyword,
      handleTsBooleanKeyword,
      handleTsVoidKeyword,
      handleTsAnyKeyword,
      handleTsUndefinedKeyword,
      handleTsUnknownKeyword,
      handleTsNullKeyword,
      handleTsTypeQuery,
      handleTsTypePredicate,
      createTsTypeLiteralHandler(
        handleIdentifierStrict,
        handleExpression,
        handleTsTypeAnnotation.handler,
        forwardHandlerRef(() => handleTsTypes)
      ),
      handleTsTypeUnion,
      handleTsTypeIntersection,
      createTsTypeReferenceHandler(
        handleIdentifierStrict,
        createTsQualifiedNameHandler(),
        forwardHandlerRef(() => handleTsTypes)
      ),
      createTsArrayTypeHandler(forwardHandlerRef(() => handleTsTypes)),
      createTsTupleTypeHandler(forwardHandlerRef(() => handleTsTypes)),
      createTsFunctionTypeHandler(
        handleIdentifierStrict,
        forwardHandlerRef(() => handleTsTypes)
      ),
      createTsLiteralTypeHandler(handleExpression),
      createTsIndexedAccessTypeHandler(forwardHandlerRef(() => handleTsTypes)),
    ],
    defaultTypeHandler
  );
  return { handleTsTypes, handleTsTypeAnnotation };
};
