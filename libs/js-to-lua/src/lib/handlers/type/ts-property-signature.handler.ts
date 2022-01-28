import {
  Expression,
  Noop,
  TSPropertySignature,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  isIdentifier,
  LuaExpression,
  LuaPropertySignature,
  LuaTypeAnnotation,
  makeOptionalAnnotation,
  typePropertySignature,
  typeString,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';

export const createTsPropertySignatureHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) => {
  const handleTsPropertySignature: BaseNodeHandler<
    LuaPropertySignature,
    TSPropertySignature
  > = createHandler('TSPropertySignature', (source, config, node) => {
    const key = expressionHandlerFunction(source, config, node.key);
    return typePropertySignature(
      isIdentifier(key)
        ? key
        : withTrailingConversionComment(
            typeString(),
            `ROBLOX TODO: unhandled node for type: TSPropertySignature with key of type ${node.key.type}`,
            source.slice(node.key.start || 0, node.key.end || 0)
          ),
      node.typeAnnotation
        ? applyTo(
            typesHandlerFunction(source, config, node.typeAnnotation),
            makeOptionalAnnotation(!!node.optional)
          )
        : undefined
    );
  });
  return handleTsPropertySignature;
};
