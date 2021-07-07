import { createHandlerFunction, HandlerFunction } from '../types';
import {
  LuaExpression,
  LuaStatement,
  TypeAnnotation,
  unhandledExpression,
  unhandledStatement,
  unhandledTypeAnnotation,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { getNodeSource } from './get-node-source';

export const defaultStatementHandler: HandlerFunction<LuaStatement> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultExpressionHandler: HandlerFunction<LuaExpression> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);

export const defaultTypeAnnotationHandler: HandlerFunction<TypeAnnotation> = createHandlerFunction(
  (source, config, node) => {
    return withConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  }
);
