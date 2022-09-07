import { createHandlerFunction } from '@js-to-lua/handler-utils';
import { unhandledStatement, UnhandledStatement } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultStatementHandler =
  createHandlerFunction<UnhandledStatement>((source, config, node) => {
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });
