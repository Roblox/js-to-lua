import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { unhandledElement, UnhandledElement } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultElementHandler: HandlerFunction<UnhandledElement> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledElement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });
