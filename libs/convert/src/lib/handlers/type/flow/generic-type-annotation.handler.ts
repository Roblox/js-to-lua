import {
  FlowType,
  GenericTypeAnnotation,
  isIdentifier as isBabelIdentifier,
  LVal,
} from '@babel/types';
import {
  isIdentifier,
  LuaLVal,
  LuaType,
  typeAny,
  typeReference,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultTypeHandler,
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createGenericTypeAnnotationHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleFlowTypes: HandlerFunction<LuaType, FlowType>
) => {
  return createHandler<LuaType, GenericTypeAnnotation>(
    'GenericTypeAnnotation',
    (source, config, node) => {
      if (!isBabelIdentifier(node.id)) {
        return withTrailingConversionComment(
          typeAny(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} when id of type ${node.id.type}`,
          getNodeSource(source, node)
        );
      }

      let params = Array<LuaType>();
      if (node.typeParameters) {
        params = node.typeParameters.params.map((param) =>
          handleFlowTypes(source, config, param)
        );
      }

      const id = handleIdentifier(source, config, node.id);

      if (isIdentifier(id)) {
        return params.length
          ? typeReference(id, params as NonEmptyArray<LuaType>)
          : typeReference(id);
      }

      return defaultTypeHandler(source, config, node);
    }
  );
};
