import {
  FlowType,
  Noop,
  TSAnyKeyword,
  TSStringKeyword,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  LuaType,
  LuaTypeAnnotation,
  LuaTypeAny,
  LuaTypeString,
} from '../lua-nodes.types';
import { combineHandlers } from '../utils/combine-handlers';
import { BaseNodeHandler } from '../types';
import { defaultTypeHandler } from '../utils/default-type.handler';

export const handleNoop: BaseNodeHandler<Noop, LuaTypeAnnotation> = {
  type: 'Noop',
  handler: (node) => {
    return {
      type: 'LuaTypeAnnotation',
      typeAnnotation: null,
    };
  },
};

export const handleTsTypeAnnotation: BaseNodeHandler<
  TSTypeAnnotation,
  LuaTypeAnnotation
> = {
  type: 'TSTypeAnnotation',
  handler: (node) => {
    return {
      type: 'LuaTypeAnnotation',
      typeAnnotation: handleTsTypes.handler(node.typeAnnotation),
    };
  },
};

export const handleFlowTypeAnnotation: BaseNodeHandler<
  TypeAnnotation,
  LuaTypeAnnotation
> = {
  type: 'TypeAnnotation',
  handler: (node) => {
    return {
      type: 'LuaTypeAnnotation',
      typeAnnotation: handleFlowTypes.handler(node.typeAnnotation),
    };
  },
};

export const typesHandler = combineHandlers<
  BaseNodeHandler<TypeAnnotation | TSTypeAnnotation | Noop, LuaTypeAnnotation>
>([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

const handleTsAnyKeyword: BaseNodeHandler<TSAnyKeyword, LuaTypeAny> = {
  type: 'TSAnyKeyword',
  handler: (node) => {
    return {
      type: 'LuaTypeAny',
    };
  },
};

const handleTsStringKeyword: BaseNodeHandler<TSStringKeyword, LuaTypeString> = {
  type: 'TSStringKeyword',
  handler: (node) => {
    return {
      type: 'LuaTypeString',
    };
  },
};

export const handleTsTypes = combineHandlers<BaseNodeHandler<TSType, LuaType>>(
  [handleTsStringKeyword, handleTsAnyKeyword],
  defaultTypeHandler
);

export const handleFlowTypes = combineHandlers<
  BaseNodeHandler<FlowType, LuaType>
>([], defaultTypeHandler);
