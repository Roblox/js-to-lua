import {
  FlowType,
  InterfaceDeclaration,
  InterfaceExtends,
  isIdentifier as isBabelIdentifier,
  TSType,
} from '@babel/types';
import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaStatement,
  LuaType,
  typeAliasDeclaration,
  typeIntersection,
  typeReference,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createFlowTypeParameterDeclarationHandler } from '../type/flow/flow-type-parameter-declaration.handler';
import { createFlowObjectTypeAnnotationHandler } from '../type/flow/object-type-annotation.handler';
import { createFlowQualifiedTypeIdentifierHandler } from '../type/flow/qualified-identifer.handler';

export const createFlowInterfaceHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleType: HandlerFunction<LuaType, TSType | FlowType>
) => {
  const handleInterfaceBody = createFlowObjectTypeAnnotationHandler(
    handleIdentifierStrict,
    handleType
  ).handler;

  return createHandler<LuaStatement, InterfaceDeclaration>(
    'InterfaceDeclaration',
    (source, config, node) => {
      if (node.mixins && node.mixins.length) {
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} with mixins array`,
          getNodeSource(source, node)
        );
      }

      if (node.implements && node.implements.length) {
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} with implements array`,
          getNodeSource(source, node)
        );
      }

      const interfaceBody = handleInterfaceBody(source, config, node.body);

      const handleTypeParameterDeclaration =
        createFlowTypeParameterDeclarationHandler(handleType).handler(
          source,
          config
        );

      const typeParameters = node.typeParameters
        ? applyTo(
            handleTypeParameterDeclaration(node.typeParameters),
            (parameters) =>
              isNonEmptyArray(parameters.params) ? parameters : undefined
          )
        : undefined;

      const handleInterfaceExtends = createHandleInterfaceExtends(
        handleIdentifierStrict,
        handleType
      )(source, config);
      return typeAliasDeclaration(
        handleIdentifierStrict(source, config, node.id),
        node.extends && node.extends.length
          ? typeIntersection([
              ...node.extends.map(handleInterfaceExtends),
              interfaceBody,
            ])
          : interfaceBody,
        typeParameters
      );
    }
  );
};

const createHandleInterfaceExtends = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleType: HandlerFunction<LuaType, TSType | FlowType>
) => {
  const handleQualifierIdentifier = createFlowQualifiedTypeIdentifierHandler(
    handleIdentifierStrict
  );

  return createHandlerFunction<LuaType, InterfaceExtends>(
    (source, config, interfaceExtends) => {
      const toType = handleType(source, config);
      const typeParams = interfaceExtends.typeParameters
        ? applyTo(
            interfaceExtends.typeParameters.params.map(toType),
            (params) => (isNonEmptyArray(params) ? params : undefined)
          )
        : undefined;
      return typeReference(
        isBabelIdentifier(interfaceExtends.id)
          ? handleIdentifierStrict(source, config, interfaceExtends.id)
          : handleQualifierIdentifier(source, config, interfaceExtends.id),
        typeParams
      );
    }
  );
};
