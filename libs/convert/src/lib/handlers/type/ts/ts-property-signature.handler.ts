import {
  Expression,
  Noop,
  TSPropertySignature,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  getNodeSource,
  getTypePropertySignatureKey,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  isIdentifier,
  isStringLiteral,
  LuaExpression,
  LuaPropertySignature,
  LuaTypeAnnotation,
  makeOptionalAnnotation,
  typePropertySignature,
  typeString,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';

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
    const annotation = node.typeAnnotation
      ? applyTo(
          typesHandlerFunction(source, config, node.typeAnnotation),
          makeOptionalAnnotation(!!node.optional)
        )
      : undefined;

    return typePropertySignature(
      isIdentifier(key) || isStringLiteral(key)
        ? getTypePropertySignatureKey(key)
        : withTrailingConversionComment(
            typeString(),
            `ROBLOX TODO: unhandled node for type: TSPropertySignature with key of type ${node.key.type}`,
            getNodeSource(source, node.key)
          ),
      annotation
    );
  });
  return handleTsPropertySignature;
};
