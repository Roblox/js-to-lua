import { FlowType, TSType, TSTypeParameter } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  identifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';

export const createTsTypeParameterHandler = (
  typesHandler: HandlerFunction<LuaType, FlowType | TSType>
) => {
  return createHandler<LuaTypeReference, TSTypeParameter>(
    'TSTypeParameter',
    (
      source,
      config,
      tsTypeParameterNode: TSTypeParameter
    ): LuaTypeReference => {
      return typeReference(
        identifier(tsTypeParameterNode.name),
        undefined,
        tsTypeParameterNode.default
          ? typesHandler(source, config, tsTypeParameterNode.default)
          : undefined
      );
    }
  );
};
