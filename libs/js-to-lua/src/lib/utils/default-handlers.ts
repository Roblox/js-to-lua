import { createHandlerFunction, HandlerFunction } from '../types';
import {
  unhandledElement,
  UnhandledElement,
  UnhandledExpression,
  unhandledExpression,
  UnhandledStatement,
  unhandledStatement,
  UnhandledTypeAnnotation,
  unhandledTypeAnnotation,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { getNodeSource } from './get-node-source';

export const defaultStatementHandler: HandlerFunction<UnhandledStatement> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultExpressionHandler: HandlerFunction<UnhandledExpression> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultTypeAnnotationHandler: HandlerFunction<UnhandledTypeAnnotation> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultElementHandler: HandlerFunction<UnhandledElement> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledElement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);
