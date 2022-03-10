import { FlowType } from '@babel/types';
import { combineHandlers } from '@js-to-lua/handler-utils';
import { defaultTypeHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaType } from '@js-to-lua/lua-types';
import { createFlowAnyTypeAnnotationHandler } from './any-type-annotation.handler';
import { createFlowBooleanTypeAnnotationHandler } from './boolean-type-annotation.handler';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';

export const createFlowTypeHandler = () => {
  const handleFlowTypes = combineHandlers<LuaType, FlowType>(
    [
      createFlowNumberTypeAnnotationHandler(),
      createFlowStringTypeAnnotationHandler(),
      createFlowBooleanTypeAnnotationHandler(),
      createFlowAnyTypeAnnotationHandler(),
    ],
    defaultTypeHandler
  );

  return handleFlowTypes;
};
