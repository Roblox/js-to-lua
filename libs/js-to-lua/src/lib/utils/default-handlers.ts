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

export const defaultStatementHandler: HandlerFunction<LuaStatement> = createHandlerFunction(
  (source, node) => {
    return withConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  }
);

export const defaultExpressionHandler: HandlerFunction<LuaExpression> = createHandlerFunction(
  (source, node) => {
    return withConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  }
);

export const defaultTypeAnnotationHandler: HandlerFunction<TypeAnnotation> = createHandlerFunction(
  (source, node) => {
    return withConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  }
);
