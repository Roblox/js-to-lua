import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  unhandledTypeAnnotation,
  UnhandledTypeAnnotation,
} from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultTypeAnnotationHandler: HandlerFunction<UnhandledTypeAnnotation> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });
