import { FlowType, TSType, TypeParameter } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  identifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';

export const createFlowTypeParameterHandler = (
  typesHandler: HandlerFunction<LuaType, FlowType | TSType>
) => {
  return createHandler<LuaTypeReference, TypeParameter>(
    'TypeParameter',
    (source, config, typeParameterNode: TypeParameter): LuaTypeReference => {
      return typeReference(
        identifier(typeParameterNode.name),
        undefined,
        typeParameterNode.default
          ? typesHandler(source, config, typeParameterNode.default)
          : undefined
      );
    }
  );
};
