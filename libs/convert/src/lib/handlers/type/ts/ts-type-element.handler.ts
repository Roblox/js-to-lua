import { Expression, FlowType, TSType, TSTypeAnnotation } from '@babel/types';
import { combineHandlers, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultElementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaType,
  LuaTypeAnnotation,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsIndexSignatureHandler } from './ts-index-signature.handler';
import { createTsMethodSignatureHandler } from './ts-method-signature.handler';
import { createTsPropertySignatureHandler } from './ts-property-signature.handler';

export const createTsTypeElementHandler = (
  handleIdentifier: IdentifierStrictHandlerFunction,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeAnnotationHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TSTypeAnnotation
  >,
  typeHandlerFunction: HandlerFunction<LuaType, TSType | FlowType>
) => {
  const handleTsPropertySignature = createTsPropertySignatureHandler(
    expressionHandlerFunction,
    typeAnnotationHandlerFunction
  );
  const handleTsIndexSignature = createTsIndexSignatureHandler(
    typeAnnotationHandlerFunction
  );

  const handleTsMethodSignature = createTsMethodSignatureHandler(
    handleIdentifier,
    expressionHandlerFunction,
    typeHandlerFunction
  );

  return combineHandlers(
    [
      handleTsPropertySignature,
      handleTsIndexSignature,
      handleTsMethodSignature,
    ],
    defaultElementHandler
  );
};
