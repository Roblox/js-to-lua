import {
  Expression,
  FlowType,
  Identifier,
  isNumericLiteral,
  isTSLiteralType,
  isTSNumberKeyword,
  Noop,
  TSAnyKeyword,
  TSBooleanKeyword,
  TSIntersectionType,
  TSNumberKeyword,
  TSStringKeyword,
  TSType,
  TSTypeAnnotation,
  TSUnionType,
  TSVoidKeyword,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  combineTypeAnnotationHandlers,
  defaultTypeHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeBoolean,
  LuaTypeIntersection,
  LuaTypeNumber,
  LuaTypeString,
  LuaTypeUnion,
  LuaTypeVoid,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeIntersection,
  typeNumber,
  typeString,
  typeUnion,
  typeVoid,
} from '@js-to-lua/lua-types';
import { uniqWith } from 'ramda';
import { createTsArrayTypeHandler } from './ts-array-type.handler';
import { createTsFunctionTypeHandler } from './ts-function-type.handler';
import { createTsLiteralTypeHandler } from './ts-literal-type.handler';
import { createTsTupleTypeHandler } from './ts-tuple-type.handler';
import { createTsTypeLiteralHandler } from './ts-type-literal.handler';
import { createTsTypeReferenceHandler } from './ts-type-reference-handler';

export const createTypeAnnotationHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>
) => {
  // TODO: move handlers to their own files
  const handleNoop: BaseNodeHandler<LuaTypeAnnotation, Noop> = createHandler(
    'Noop',
    () => typeAnnotation(typeAny())
  );

  const handleTsTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TSTypeAnnotation
  > = createHandler('TSTypeAnnotation', (source, config, node) =>
    typeAnnotation(handleTsTypes.handler(source, config, node.typeAnnotation))
  );

  const handleFlowTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TypeAnnotation
  > = createHandler('TypeAnnotation', (source, config, node) =>
    typeAnnotation(handleFlowTypes.handler(source, config, node.typeAnnotation))
  );

  const typesHandler = combineTypeAnnotationHandlers<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

  const handleTsAnyKeyword: BaseNodeHandler<LuaTypeAny, TSAnyKeyword> =
    createHandler('TSAnyKeyword', () => typeAny());

  const handleTsStringKeyword: BaseNodeHandler<LuaTypeString, TSStringKeyword> =
    createHandler('TSStringKeyword', () => typeString());

  const handleTsNumberKeyword: BaseNodeHandler<LuaTypeNumber, TSNumberKeyword> =
    createHandler('TSNumberKeyword', () => typeNumber());

  const handleTsBooleanKeyword: BaseNodeHandler<
    LuaTypeBoolean,
    TSBooleanKeyword
  > = createHandler('TSBooleanKeyword', () => typeBoolean());

  const handleTsVoidKeyword: BaseNodeHandler<LuaTypeVoid, TSVoidKeyword> =
    createHandler('TSVoidKeyword', () => typeVoid());

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
      createTsTypeLiteralHandler(expressionHandlerFunction, typesHandler),
      handleTsTypeUnion,
      handleTsTypeIntersection,
      createTsTypeReferenceHandler(
        identifierHandlerFunction,
        forwardHandlerRef(() => handleTsTypes)
      ),
      createTsArrayTypeHandler(forwardHandlerRef(() => handleTsTypes)),
      createTsTupleTypeHandler(forwardHandlerRef(() => handleTsTypes)),
      createTsFunctionTypeHandler(
        expressionHandlerFunction,
        forwardHandlerRef(() => handleTsTypes)
      ),
      createTsLiteralTypeHandler(expressionHandlerFunction),
    ],
    defaultTypeHandler
  );

  const handleFlowTypes = combineHandlers<LuaType, FlowType>(
    [],
    defaultTypeHandler
  );

  return {
    typesHandler,
    handleTsTypes,
  };
};
