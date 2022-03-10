import { StringTypeAnnotation } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { LuaTypeString, typeString } from '@js-to-lua/lua-types';

export const createFlowStringTypeAnnotationHandler = () => {
  const handleStringTypeAnnotation: BaseNodeHandler<
    LuaTypeString,
    StringTypeAnnotation
  > = createHandler('StringTypeAnnotation', () => typeString());
  return handleStringTypeAnnotation;
};
