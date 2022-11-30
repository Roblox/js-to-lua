import {
  FlowType,
  GenericTypeAnnotation,
  Identifier,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  FlowBuiltInTypeId,
  requiresFlowBuiltInType,
  withFlowBuiltInTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFlowQualifiedTypeIdentifierHandler } from './qualified-identifer.handler';

export const handleFlowIdentifier = (node: Identifier): LuaIdentifier => {
  if (node.name.startsWith('$')) {
    return identifier(node.name.slice(1));
  }
  return identifier(node.name);
};

export const createFlowGenericTypeBuiltInAnnotationHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowTypes: HandlerFunction<LuaType, FlowType>
) => {
  return createOptionalHandlerFunction<LuaType, GenericTypeAnnotation>(
    (source, config, node) => {
      const handleFlowQualifiedTypeIdentifier =
        createFlowQualifiedTypeIdentifierHandler(handleIdentifierStrict);

      const id = isBabelIdentifier(node.id)
        ? handleFlowIdentifier(node.id)
        : handleFlowQualifiedTypeIdentifier(source, config, node.id);

      const builtInType = requiresFlowBuiltInType.find(
        (type) => type.name === id.name
      );

      if (builtInType) {
        const handleType = handleFlowTypes(source, config);

        return withFlowBuiltInTypeExtra<LuaType, FlowBuiltInTypeId>(
          builtInType.name as FlowBuiltInTypeId,
          builtInType.generics
        )(
          typeReference(
            id,
            (node.typeParameters?.params?.length &&
              (node.typeParameters.params.map(
                handleType
              ) as NonEmptyArray<LuaTypeReference>)) ||
              undefined
          )
        );
      }
    }
  );
};
