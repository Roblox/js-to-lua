import { BooleanTypeAnnotation } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { LuaTypeBoolean, typeBoolean } from '@js-to-lua/lua-types';

export const createFlowBooleanTypeAnnotationHandler = () => {
  const handleBooleanTypeAnnotation: BaseNodeHandler<
    LuaTypeBoolean,
    BooleanTypeAnnotation
  > = createHandler('BooleanTypeAnnotation', () => typeBoolean());
  return handleBooleanTypeAnnotation;
};
