import { createHandlerFunction } from '@js-to-lua/handler-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultUnhandledIdentifierHandlerWithComment = (
  comment?: string
) =>
  createHandlerFunction<LuaIdentifier>((source, config, node) =>
    withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      comment || `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    )
  );

export const defaultUnhandledIdentifierHandler =
  defaultUnhandledIdentifierHandlerWithComment();
