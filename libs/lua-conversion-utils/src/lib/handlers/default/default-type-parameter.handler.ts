import { createHandlerFunction } from '@js-to-lua/handler-utils';
import {
  LuaTypeParameterDeclaration,
  typeParameterDeclaration,
  typeReference,
} from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';
import { unhandledIdentifier } from './default-unhandled-identifier.handler';

export const defaultTypeParameterHandler =
  createHandlerFunction<LuaTypeParameterDeclaration>((source, config, node) => {
    return withTrailingConversionComment(
      typeParameterDeclaration([typeReference(unhandledIdentifier())]),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });
