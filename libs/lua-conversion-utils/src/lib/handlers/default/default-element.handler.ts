import { createHandlerFunction } from '@js-to-lua/handler-utils';
import {
  LuaTypeElement,
  typeAnnotation,
  typeNil,
  typePropertySignature,
} from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';
import { unhandledIdentifier } from './default-unhandled-identifier.handler';

export const defaultElementHandler = createHandlerFunction<LuaTypeElement>(
  (source, config, node) => {
    return withTrailingConversionComment(
      typePropertySignature(unhandledIdentifier(), typeAnnotation(typeNil())),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);
