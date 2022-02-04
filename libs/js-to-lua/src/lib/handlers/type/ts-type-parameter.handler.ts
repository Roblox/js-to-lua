import { TSTypeParameter } from '@babel/types';
import {
  identifier,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { createHandler } from '@js-to-lua/handler-utils';

export const createTsTypeParameterHandler = () => {
  return createHandler<LuaTypeReference, TSTypeParameter>(
    'TSTypeParameter',
    (
      _source,
      _config,
      tsTypeParameterNode: TSTypeParameter
    ): LuaTypeReference => typeReference(identifier(tsTypeParameterNode.name))
  );
};
