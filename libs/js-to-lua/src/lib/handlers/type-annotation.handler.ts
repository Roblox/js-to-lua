import {
  Expression,
  FlowType,
  Noop,
  TSAnyKeyword,
  TSBooleanKeyword,
  TSNumberKeyword,
  TSPropertySignature,
  TSStringKeyword,
  TSType,
  TSTypeAnnotation,
  TSTypeLiteral,
  TSVoidKeyword,
  TypeAnnotation,
} from '@babel/types';
import {
  LuaExpression,
  LuaPropertySignature,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeBoolean,
  LuaTypeLiteral,
  LuaTypeNumber,
  LuaTypeString,
  LuaTypeVoid,
  typeAnnotation,
} from '@js-to-lua/lua-types';
import {
  combineHandlers,
  combineTypeAnnotationHandlers,
} from '../utils/combine-handlers';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { defaultTypeHandler } from '../utils/default-type.handler';

export const createTypeAnnotationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleNoop: BaseNodeHandler<
    LuaTypeAnnotation,
    Noop
  > = createHandler('Noop', () => typeAnnotation());

  const handleTsTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TSTypeAnnotation
  > = createHandler('TSTypeAnnotation', (source, node) =>
    typeAnnotation(handleTsTypes.handler(source, node.typeAnnotation))
  );

  const handleFlowTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TypeAnnotation
  > = createHandler('TypeAnnotation', (source, node) =>
    typeAnnotation(handleFlowTypes.handler(source, node.typeAnnotation))
  );

  const typesHandler = combineTypeAnnotationHandlers<
    LuaTypeAnnotation,
    BaseNodeHandler<LuaTypeAnnotation, TypeAnnotation | TSTypeAnnotation | Noop>
  >([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

  const handleTsAnyKeyword: BaseNodeHandler<
    LuaTypeAny,
    TSAnyKeyword
  > = createHandler('TSAnyKeyword', () => ({
    type: 'LuaTypeAny',
  }));

  const handleTsStringKeyword: BaseNodeHandler<
    LuaTypeString,
    TSStringKeyword
  > = createHandler('TSStringKeyword', () => ({
    type: 'LuaTypeString',
  }));

  const handleTsNumberKeyword: BaseNodeHandler<
    LuaTypeNumber,
    TSNumberKeyword
  > = createHandler('TSNumberKeyword', () => ({
    type: 'LuaTypeNumber',
  }));

  const handleTsBooleanKeyword: BaseNodeHandler<
    LuaTypeBoolean,
    TSBooleanKeyword
  > = createHandler('TSBooleanKeyword', () => ({
    type: 'LuaTypeBoolean',
  }));

  const handleTsVoidKeyword: BaseNodeHandler<
    LuaTypeVoid,
    TSVoidKeyword
  > = createHandler('TSVoidKeyword', () => ({
    type: 'LuaTypeVoid',
  }));

  const handleTsTypeLiteral: BaseNodeHandler<
    LuaTypeLiteral,
    TSTypeLiteral
  > = createHandler('TSTypeLiteral', (source, node) => ({
    type: 'LuaTypeLiteral',
    members: node.members.map(handleTsPropertySignature.handler(source)),
  }));

  const handleTsPropertySignature: BaseNodeHandler<
    LuaPropertySignature,
    TSPropertySignature
  > = createHandler('TSPropertySignature', (source, node) => ({
    type: 'LuaPropertySignature',
    key: handleExpression(source, node.key),
    ...(node.typeAnnotation
      ? { typeAnnotation: typesHandler(source, node.typeAnnotation) }
      : {}),
  }));

  const handleTsTypes = combineHandlers<
    LuaType,
    BaseNodeHandler<LuaType, TSType>
  >(
    [
      handleTsStringKeyword,
      handleTsNumberKeyword,
      handleTsBooleanKeyword,
      handleTsVoidKeyword,
      handleTsAnyKeyword,
      handleTsTypeLiteral,
    ],
    defaultTypeHandler
  );

  const handleFlowTypes = combineHandlers<
    LuaType,
    BaseNodeHandler<LuaType, FlowType>
  >([], defaultTypeHandler);

  return {
    typesHandler,
    handleTsTypes,
  };
};
