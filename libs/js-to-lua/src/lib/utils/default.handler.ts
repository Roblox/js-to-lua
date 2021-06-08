import { createHandlerFunction, HandlerFunction } from '../types';
import { unhandledNode } from '@js-to-lua/lua-types';

export const defaultHandler: HandlerFunction = createHandlerFunction(
  (source, node) => {
    return unhandledNode(source.slice(node.start, node.end));
  }
);
