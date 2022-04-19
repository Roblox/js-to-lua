import { FlowType } from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  forwardHandlerRef,
} from '@js-to-lua/handler-utils';
import { defaultTypeHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaType } from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFlowAnyTypeAnnotationHandler } from './any-type-annotation.handler';
import { createFlowBooleanTypeAnnotationHandler } from './boolean-type-annotation.handler';
import { createFlowGenericTypeAnnotationHandler } from './flow-generic-type-annotation.handler';
import { createFunctionTypeAnnotationHandler } from './function-type-annotation.handler';
import { createNullableTypeAnnotationHandler } from './nullable-type-annotation.handler';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';

export const createFlowTypeHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction
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
        handleIdentifierStrict,
        forwardHandlerRef(() => handleFlowTypes)
      ),
      createNullableTypeAnnotationHandler(
        forwardHandlerRef(() => handleFlowTypes)
      ),
      createFunctionTypeAnnotationHandler(
        handleIdentifierStrict,
        forwardHandlerRef(() => handleFlowTypes)
      ),
    ],
    defaultTypeHandler
  );

  return handleFlowTypes;
};
