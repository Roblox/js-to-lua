import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { unhandledExpression, UnhandledExpression } from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultExpressionHandler: HandlerFunction<UnhandledExpression> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });
