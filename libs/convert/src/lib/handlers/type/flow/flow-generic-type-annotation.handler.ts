import {
  FlowType,
  GenericTypeAnnotation,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultTypeHandler,
  PolyfillTypeID,
  requiresFlowTypePolyfill,
  withPolyfillTypeExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  isIdentifier,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFlowGenericTypeSpecialCasesHandler } from './flow-generic-type-special-cases.handler';
import { createFlowQualifiedTypeIdentifierHandler } from './qualified-identifer.handler';

export const createFlowGenericTypeAnnotationHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowTypes: HandlerFunction<LuaType, FlowType>
) => {
  return createHandler<LuaType, GenericTypeAnnotation>(
    'GenericTypeAnnotation',
    (source, config, node) => {
      const handled = createFlowGenericTypeSpecialCasesHandler(
        handleIdentifierStrict,
        handleFlowTypes
      )(source, config, node);

      if (handled) return handled;

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
        const polyfillType = requiresFlowTypePolyfill.find(
          (type) => type.name === id.name
        );

        const returnValue = isNonEmptyArray(params)
          ? typeReference(id, params)
          : typeReference(id);

        return polyfillType
          ? withPolyfillTypeExtra<LuaTypeReference, PolyfillTypeID>(
              polyfillType.name,
              polyfillType.generics
            )(returnValue)
          : returnValue;
      }

      return defaultTypeHandler(source, config, node);
    }
  );
};
