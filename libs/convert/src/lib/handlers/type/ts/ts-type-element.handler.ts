import { Expression, TSTypeAnnotation } from '@babel/types';
import { combineHandlers, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultElementHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaExpression, LuaTypeAnnotation } from '@js-to-lua/lua-types';
import { createTsIndexSignatureHandler } from './ts-index-signature.handler';
import { createTsPropertySignatureHandler } from './ts-property-signature.handler';

export const createTsTypeElementHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<LuaTypeAnnotation, TSTypeAnnotation>
) => {
  const handleTsPropertySignature = createTsPropertySignatureHandler(
    expressionHandlerFunction,
    typesHandlerFunction
  );
  const handleTsIndexSignature =
    createTsIndexSignatureHandler(typesHandlerFunction);

  return combineHandlers(
    [handleTsPropertySignature, handleTsIndexSignature],
    defaultElementHandler
  );
};
