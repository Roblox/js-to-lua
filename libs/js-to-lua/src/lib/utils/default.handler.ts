import { createHandlerFunction, HandlerFunction } from '../types';
import { unhandledNode, withConversionComment } from '@js-to-lua/lua-types';

export const defaultHandler: HandlerFunction = createHandlerFunction(
  (source, node) => {
    return withConversionComment(
      unhandledNode(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  }
);
