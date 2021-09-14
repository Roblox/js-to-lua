import {
  Expression,
  FlowType,
  Identifier,
  Noop,
  TSAnyKeyword,
  TSBooleanKeyword,
  TSNumberKeyword,
  TSPropertySignature,
  TSStringKeyword,
  TSType,
  TSTypeAnnotation,
  TSTypeLiteral,
  TSUnionType,
  TSVoidKeyword,
  TypeAnnotation,
} from '@babel/types';
import {
  LuaExpression,
  LuaIdentifier,
  LuaPropertySignature,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeBoolean,
  LuaTypeLiteral,
  LuaTypeNumber,
  LuaTypeString,
  LuaTypeUnion,
  LuaTypeVoid,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeLiteral,
  typeNumber,
  typeString,
  typeUnion,
  typeVoid,
} from '@js-to-lua/lua-types';
import {
  combineHandlers,
  combineTypeAnnotationHandlers,
} from '../../utils/combine-handlers';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  defaultElementHandler,
  defaultTypeHandler,
} from '../../utils/default-handlers';
import { createTsTypeReferenceHandler } from './ts-type-reference-handler';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';

export const createTypeAnnotationHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>
) => {
  const handleNoop: BaseNodeHandler<
    LuaTypeAnnotation,
    Noop
  > = createHandler('Noop', () => typeAnnotation());

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

  const handleTsAnyKeyword: BaseNodeHandler<
    LuaTypeAny,
    TSAnyKeyword
  > = createHandler('TSAnyKeyword', () => typeAny());

  const handleTsStringKeyword: BaseNodeHandler<
    LuaTypeString,
    TSStringKeyword
  > = createHandler('TSStringKeyword', () => typeString());

  const handleTsNumberKeyword: BaseNodeHandler<
    LuaTypeNumber,
    TSNumberKeyword
  > = createHandler('TSNumberKeyword', () => typeNumber());

  const handleTsBooleanKeyword: BaseNodeHandler<
    LuaTypeBoolean,
    TSBooleanKeyword
  > = createHandler('TSBooleanKeyword', () => typeBoolean());

  const handleTsVoidKeyword: BaseNodeHandler<
    LuaTypeVoid,
    TSVoidKeyword
  > = createHandler('TSVoidKeyword', () => typeVoid());

  const handleTsTypeLiteral: BaseNodeHandler<
    LuaTypeLiteral,
    TSTypeLiteral
  > = createHandler('TSTypeLiteral', (source, config, node) =>
    typeLiteral(
      node.members.map(
        combineHandlers(
          [handleTsPropertySignature],
          defaultElementHandler
        ).handler(source, config)
      )
    )
  );

  const handleTsPropertySignature: BaseNodeHandler<
    LuaPropertySignature,
    TSPropertySignature
  > = createHandler('TSPropertySignature', (source, config, node) => ({
    type: 'LuaPropertySignature',
    key: expressionHandlerFunction(source, config, node.key),
    ...(node.typeAnnotation
      ? { typeAnnotation: typesHandler(source, config, node.typeAnnotation) }
      : {}),
  }));

  const handleTsTypeUnion: BaseNodeHandler<
    LuaTypeUnion,
    TSUnionType
  > = createHandler('TSUnionType', (source, config, node) =>
    typeUnion(node.types.map(handleTsTypes.handler(source, config)))
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
      handleTsTypeLiteral,
      handleTsTypeUnion,
      createTsTypeReferenceHandler(
        identifierHandlerFunction,
        forwardHandlerRef(() => handleTsTypes)
      ),
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
