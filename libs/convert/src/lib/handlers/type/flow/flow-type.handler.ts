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
import { createFlowMixedTypeAnnotationHandler } from './mixed-type-annotation.handler';
import { createNullLiteralTypeAnnotationHandler } from './null-literal-type-annotation';
import { createNullableTypeAnnotationHandler } from './nullable-type-annotation.handler';
import { createFlowNumberLiteralTypeAnnotationHandler } from './number-literal-type-annotation.handler';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';
import { createFlowObjectTypeAnnotationHandler } from './object-type-annotation.handler';
import { createStringLiteralTypeAnnotationHandler } from './string-literal-type-annotation.handler';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';
import { createTupleTypeAnnotationHandler } from './tuple-type-annotation.handler';
import { createFlowTypeofTypeAnnotationHandler } from './typeof-type-annotation.handler';
import { createUnionTypeAnnotationHandler } from './union-type-annotation.handler';
import { createFlowVoidTypeAnnotationHandler } from './void-type-annotation.handler';

export const createFlowTypeHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  const forwardedHandleFlowType = forwardHandlerRef(() => handleFlowTypes);
  const handleFlowTypes: BaseNodeHandler<LuaType, FlowType> = combineHandlers<
    LuaType,
    FlowType
  >(
    [
      createFlowNumberTypeAnnotationHandler(),
      createFlowStringTypeAnnotationHandler(),
      createFlowBooleanTypeAnnotationHandler(),
      createFlowAnyTypeAnnotationHandler(),
      createFlowNumberLiteralTypeAnnotationHandler(),
      createFlowVoidTypeAnnotationHandler(),
      createFlowGenericTypeAnnotationHandler(
        handleIdentifierStrict,
        forwardedHandleFlowType
      ),
      createNullableTypeAnnotationHandler(forwardedHandleFlowType),
      createFunctionTypeAnnotationHandler(
        handleIdentifierStrict,
        forwardedHandleFlowType
      ),
      createUnionTypeAnnotationHandler(forwardedHandleFlowType),
      createFlowObjectTypeAnnotationHandler(
        handleIdentifierStrict,
        forwardedHandleFlowType
      ),
      createFlowTypeofTypeAnnotationHandler(forwardedHandleFlowType),
      createNullLiteralTypeAnnotationHandler(),
      createStringLiteralTypeAnnotationHandler(),
      createFlowMixedTypeAnnotationHandler(),
      createTupleTypeAnnotationHandler(forwardedHandleFlowType),
    ],
    defaultTypeHandler
  );

  return handleFlowTypes;
};
