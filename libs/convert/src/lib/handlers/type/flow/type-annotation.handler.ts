import { FlowType, TypeAnnotation } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaType,
  LuaTypeAnnotation,
  typeAnnotation,
} from '@js-to-lua/lua-types';

export const createFlowTypeAnnotationHandler = (
  flowTypesHandler: HandlerFunction<LuaType, FlowType>
) => {
  const handleFlowTypeAnnotation: BaseNodeHandler<
    LuaTypeAnnotation,
    TypeAnnotation
  > = createHandler('TypeAnnotation', (source, config, node) =>
    typeAnnotation(flowTypesHandler(source, config, node.typeAnnotation))
  );
  return handleFlowTypeAnnotation;
};
