import { FlowType, LVal } from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultTypeHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaLVal, LuaType } from '@js-to-lua/lua-types';
import { createFlowAnyTypeAnnotationHandler } from './any-type-annotation.handler';
import { createFlowBooleanTypeAnnotationHandler } from './boolean-type-annotation.handler';
import { createFlowGenericTypeAnnotationHandler } from './flow-generic-type-annotation.handler';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';

export const createFlowTypeHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, LVal>
) => {
  const handleFlowTypes: BaseNodeHandler<LuaType, FlowType> = combineHandlers<
    LuaType,
    FlowType
  >(
    [
      createFlowNumberTypeAnnotationHandler(),
      createFlowStringTypeAnnotationHandler(),
      createFlowBooleanTypeAnnotationHandler(),
      createFlowAnyTypeAnnotationHandler(),
      createFlowGenericTypeAnnotationHandler(
        handleIdentifier,
        forwardHandlerRef(() => handleFlowTypes)
      ),
    ],
    defaultTypeHandler
  );

  return handleFlowTypes;
};
