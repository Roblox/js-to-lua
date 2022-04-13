import { FlowType, NullableTypeAnnotation } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType, typeOptional } from '@js-to-lua/lua-types';

export const createNullableTypeAnnotationHandler = (
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  return createHandler<LuaType, NullableTypeAnnotation>(
    'NullableTypeAnnotation',
    (source, config, node) => {
      return typeOptional(handleFlowType(source, config, node.typeAnnotation));
    }
  );
};
