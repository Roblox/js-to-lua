import { FlowType, ObjectTypeIndexer } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaType,
  LuaTypeElement,
  typeAnnotation,
  typeIndexSignature,
} from '@js-to-lua/lua-types';

export const createObjectTypeIndexerHandler = (
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  return createHandlerFunction<LuaTypeElement, ObjectTypeIndexer>(
    (source, config, node) => {
      const key = handleFlowType(source, config, node.key);
      const annotation = typeAnnotation(
        handleFlowType(source, config, node.value)
      );
      return typeIndexSignature(key, annotation);
    }
  );
};
