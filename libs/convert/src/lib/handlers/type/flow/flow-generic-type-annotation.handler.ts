import {
  FlowType,
  GenericTypeAnnotation,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import { isIdentifier, LuaType, typeReference } from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultTypeHandler } from '@js-to-lua/lua-conversion-utils';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFlowQualifiedTypeIdentifierHandler } from './qualified-identifer.handler';

export const createFlowGenericTypeAnnotationHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowTypes: HandlerFunction<LuaType, FlowType>
) => {
  return createHandler<LuaType, GenericTypeAnnotation>(
    'GenericTypeAnnotation',
    (source, config, node) => {
      let params = Array<LuaType>();
      if (node.typeParameters) {
        params = node.typeParameters.params.map((param) =>
          handleFlowTypes(source, config, param)
        );
      }

      const handleFlowQualifiedTypeIdentifier =
        createFlowQualifiedTypeIdentifierHandler(handleIdentifierStrict);

      const id = isBabelIdentifier(node.id)
        ? handleIdentifierStrict(source, config, node.id)
        : handleFlowQualifiedTypeIdentifier(source, config, node.id);

      if (isIdentifier(id)) {
        return params.length
          ? typeReference(id, params as NonEmptyArray<LuaType>)
          : typeReference(id);
      }

      return defaultTypeHandler(source, config, node);
    }
  );
};
