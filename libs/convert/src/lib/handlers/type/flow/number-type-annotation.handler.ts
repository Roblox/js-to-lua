import { NumberTypeAnnotation } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { LuaTypeNumber, typeNumber } from '@js-to-lua/lua-types';

export const createFlowNumberTypeAnnotationHandler = () => {
  const handleNumberTypeAnnotation: BaseNodeHandler<
    LuaTypeNumber,
    NumberTypeAnnotation
  > = createHandler('NumberTypeAnnotation', () => typeNumber());
  return handleNumberTypeAnnotation;
};
