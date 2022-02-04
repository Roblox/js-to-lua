import { createHandlerFunction } from '@js-to-lua/handler-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultUnhandledIdentifierHandler =
  createHandlerFunction<LuaIdentifier>((source, config, node) =>
    withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    )
  );
