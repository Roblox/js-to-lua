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
import { defaultElementHandler } from '../utils/default-handlers';

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
  > = createHandler('TSTypeLiteral', (source, config, node) => ({
    type: 'LuaTypeLiteral',
    members: node.members.map(
      combineHandlers(
        [handleTsPropertySignature],
        defaultElementHandler
      ).handler(source, config)
    ),
  }));

  const handleTsPropertySignature: BaseNodeHandler<
    LuaPropertySignature,
    TSPropertySignature
  > = createHandler('TSPropertySignature', (source, config, node) => ({
    type: 'LuaPropertySignature',
    key: handleExpression(source, config, node.key),
    ...(node.typeAnnotation
      ? { typeAnnotation: typesHandler(source, config, node.typeAnnotation) }
      : {}),
  }));

  const handleTsTypes = combineHandlers<LuaType, TSType>(
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

  const handleFlowTypes = combineHandlers<LuaType, FlowType>(
    [],
    defaultTypeHandler
  );

  return {
    typesHandler,
    handleTsTypes,
  };
};
