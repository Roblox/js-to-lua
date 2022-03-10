import { AnyTypeAnnotation } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { LuaTypeAny, typeAny } from '@js-to-lua/lua-types';

export const createFlowAnyTypeAnnotationHandler = () => {
  const handleAnyTypeAnnotation: BaseNodeHandler<
    LuaTypeAny,
    AnyTypeAnnotation
  > = createHandler('AnyTypeAnnotation', () => typeAny());
  return handleAnyTypeAnnotation;
};
