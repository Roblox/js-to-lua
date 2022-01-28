import { FlowType, TSType } from '@babel/types';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  typeAny,
  unhandledElement,
  UnhandledElement,
  UnhandledExpression,
  unhandledExpression,
  UnhandledStatement,
  unhandledStatement,
  UnhandledTypeAnnotation,
  unhandledTypeAnnotation,
} from '@js-to-lua/lua-types';
import { createHandlerFunction, HandlerFunction } from '../types';
import { getNodeSource } from './get-node-source';

export const defaultStatementHandler: HandlerFunction<UnhandledStatement> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

export const defaultExpressionHandler: HandlerFunction<UnhandledExpression> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

export const defaultTypeAnnotationHandler: HandlerFunction<UnhandledTypeAnnotation> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledTypeAnnotation(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

export const defaultElementHandler: HandlerFunction<UnhandledElement> =
  createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      unhandledElement(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

export const defaultUnhandledIdentifierHandler =
  createHandlerFunction<LuaIdentifier>((source, config, node) =>
    withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    )
  );

export const defaultTypeHandler = createHandlerFunction<
  LuaType,
  TSType | FlowType
>((source, config, node) =>
  withTrailingConversionComment(
    typeAny(),
    `ROBLOX TODO: Unhandled node for type: ${node.type}`,
    getNodeSource(source, node)
  )
);
