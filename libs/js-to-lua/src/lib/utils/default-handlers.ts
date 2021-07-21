import { createHandlerFunction, HandlerFunction } from '../types';
import {
  identifier,
  LuaIdentifier,
  unhandledElement,
  UnhandledElement,
  UnhandledExpression,
  unhandledExpression,
  UnhandledStatement,
  unhandledStatement,
  UnhandledTypeAnnotation,
  unhandledTypeAnnotation,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { getNodeSource } from './get-node-source';

export const defaultStatementHandler: HandlerFunction<UnhandledStatement> = createHandlerFunction(
  (source, config, node) => {
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultExpressionHandler: HandlerFunction<UnhandledExpression> = createHandlerFunction(
  (source, config, node) => {
    return withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultTypeAnnotationHandler: HandlerFunction<UnhandledTypeAnnotation> = createHandlerFunction(
  (source, config, node) => {
    return withTrailingConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultElementHandler: HandlerFunction<UnhandledElement> = createHandlerFunction(
  (source, config, node) => {
    return withTrailingConversionComment(
      unhandledElement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultUnhandledIdentifierHandler = createHandlerFunction<LuaIdentifier>(
  (source, config, node) =>
    withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    )
);
