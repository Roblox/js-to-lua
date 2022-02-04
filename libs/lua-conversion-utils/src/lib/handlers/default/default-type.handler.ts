import { FlowType, TSType } from '@babel/types';
import { createHandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType, typeAny } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultTypeHandler = createHandlerFunction<
  LuaType,
  TSType | FlowType
>((source, config, node) =>
  withTrailingConversionComment(
    typeAny(),
    `ROBLOX TODO: Unhandled node for type: ${node.type}`,
    getNodeSource(source, node)
  )
);
