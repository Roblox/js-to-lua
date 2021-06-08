import {
  FlowType,
  Noop,
  TSAnyKeyword,
  TSStringKeyword,
  TSNumberKeyword,
  TSBooleanKeyword,
  TSPropertySignature,
  TSType,
  TSTypeAnnotation,
  TSTypeLiteral,
  TypeAnnotation,
  TSVoidKeyword,
} from '@babel/types';
import {
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeString,
  LuaTypeNumber,
  LuaTypeBoolean,
  LuaPropertySignature,
  LuaTypeLiteral,
  LuaTypeVoid,
  typeAnnotation,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler, createHandler } from '../types';
import { defaultTypeHandler } from '../utils/default-type.handler';
import { handleExpression } from './expression-statement.handler';

export const handleNoop: BaseNodeHandler<
  Noop,
  LuaTypeAnnotation
> = createHandler('Noop', () => typeAnnotation(null));

export const handleTsTypeAnnotation: BaseNodeHandler<
  TSTypeAnnotation,
  LuaTypeAnnotation
> = createHandler('TSTypeAnnotation', (source, node) =>
  typeAnnotation(handleTsTypes.handler(source, node.typeAnnotation))
);

export const handleFlowTypeAnnotation: BaseNodeHandler<
  TypeAnnotation,
  LuaTypeAnnotation
> = createHandler('TypeAnnotation', (source, node) =>
  typeAnnotation(handleFlowTypes.handler(source, node.typeAnnotation))
);

export const typesHandler = combineHandlers<
  BaseNodeHandler<TypeAnnotation | TSTypeAnnotation | Noop, LuaTypeAnnotation>
>([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

const handleTsAnyKeyword: BaseNodeHandler<
  TSAnyKeyword,
  LuaTypeAny
> = createHandler('TSAnyKeyword', () => ({
  type: 'LuaTypeAny',
}));

const handleTsStringKeyword: BaseNodeHandler<
  TSStringKeyword,
  LuaTypeString
> = createHandler('TSStringKeyword', () => ({
  type: 'LuaTypeString',
}));

const handleTsNumberKeyword: BaseNodeHandler<
  TSNumberKeyword,
  LuaTypeNumber
> = createHandler('TSNumberKeyword', () => ({
  type: 'LuaTypeNumber',
}));

const handleTsBooleanKeyword: BaseNodeHandler<
  TSBooleanKeyword,
  LuaTypeBoolean
> = createHandler('TSBooleanKeyword', () => ({
  type: 'LuaTypeBoolean',
}));

const handleTsVoidKeyword: BaseNodeHandler<
  TSVoidKeyword,
  LuaTypeVoid
> = createHandler('TSVoidKeyword', () => ({
  type: 'LuaTypeVoid',
}));

const handleTsTypeLiteral: BaseNodeHandler<
  TSTypeLiteral,
  LuaTypeLiteral
> = createHandler('TSTypeLiteral', (source, node) => ({
  type: 'LuaTypeLiteral',
  members: node.members.map(handleTsPropertySignature.handler(source)),
}));

const handleTsPropertySignature: BaseNodeHandler<
  TSPropertySignature,
  LuaPropertySignature
> = createHandler('TSPropertySignature', (source, node) => ({
  type: 'LuaPropertySignature',
  key: handleExpression.handler(source, node.key),
  ...(node.typeAnnotation
    ? { typeAnnotation: typesHandler(source, node.typeAnnotation) }
    : {}),
}));

export const handleTsTypes = combineHandlers<BaseNodeHandler<TSType, LuaType>>(
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

export const handleFlowTypes = combineHandlers<
  BaseNodeHandler<FlowType, LuaType>
>([], defaultTypeHandler);
