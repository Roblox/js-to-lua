import { FlowType } from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaType } from '@js-to-lua/lua-types';
import { createFlowGenericTypeBuiltInAnnotationHandler } from './flow-generic-type-built-in-annotation.handler';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';

export const createFlowGenericTypeSpecialCasesHandler = (
  identifierHandlerFunction: IdentifierStrictHandlerFunction,
  tsTypeHandlerFunction: HandlerFunction<LuaType, FlowType>
) =>
  combineOptionalHandlerFunctions<LuaType, FlowType>([
    createFlowGenericTypeBuiltInAnnotationHandler(
      identifierHandlerFunction,
      tsTypeHandlerFunction
    ),
  ]);
