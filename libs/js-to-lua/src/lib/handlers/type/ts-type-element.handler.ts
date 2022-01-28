import {
  Expression,
  Noop,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { LuaExpression, LuaTypeAnnotation } from '@js-to-lua/lua-types';
import { HandlerFunction } from '../../types';
import { combineHandlers } from '../../utils/combine-handlers';
import { defaultElementHandler } from '../../utils/default-handlers';
import { createTsIndexSignatureHandler } from './ts-index-signature.handler';
import { createTsPropertySignatureHandler } from './ts-property-signature.handler';

export const createTsTypeElementHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
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
