import {
  FlowType,
  isObjectTypeProperty,
  isObjectTypeSpreadProperty,
  ObjectTypeAnnotation,
  ObjectTypeProperty,
  ObjectTypeSpreadProperty,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withInnerConversionComment,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaType,
  typeAny,
  typeIntersection,
  typeLiteral,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { applyTo, uniq } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createObjectTypeIndexerHandler } from './object-type-indexer.handler';
import { createObjectTypePropertyHandler } from './object-type-property.handler';
import { createObjectTypeSpreadPropertyHandler } from './object-type-spread-property.handler';

// eslint-disable-next-line @typescript-eslint/ban-types
type MaybeBabelNode = object | null | undefined;
const isBabelObjectTypeProperty = (
  node: MaybeBabelNode
): node is ObjectTypeProperty => isObjectTypeProperty(node);
const isBabelObjectTypeSpreadProperty = (
  node: MaybeBabelNode
): node is ObjectTypeSpreadProperty => isObjectTypeSpreadProperty(node);

export const createFlowObjectTypeAnnotationHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  const objectTypePropertyHandler = createObjectTypePropertyHandler(
    handleIdentifierStrict,
    handleFlowType
  );
  const objectTypeSpreadPropertyHandlerFunction =
    createObjectTypeSpreadPropertyHandler(handleFlowType);
  const objectTypeIndexerHandlerFunction =
    createObjectTypeIndexerHandler(handleFlowType);

  return createHandler<LuaType, ObjectTypeAnnotation>(
    'ObjectTypeAnnotation',
    (source, config, node) => {
      const handleObjectTypeProperty = objectTypePropertyHandler(
        source,
        config
      );
      const handleObjectTypeSpreadProperty =
        objectTypeSpreadPropertyHandlerFunction(source, config);

      const handleTypeIndexer = objectTypeIndexerHandlerFunction(
        source,
        config
      );

      if (node.indexers && node.indexers.length > 1) {
        return withTrailingConversionComment(
          typeAny(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} when multiple indexers are present`,
          getNodeSource(source, node)
        );
      }

      const objectTypeProperties = node.properties
        .filter(isBabelObjectTypeProperty)
        .map(handleObjectTypeProperty);
      const spreadProperties = node.properties
        .filter(isBabelObjectTypeSpreadProperty)
        .map(handleObjectTypeSpreadProperty);
      const indexProperties = (node.indexers || []).map(handleTypeIndexer);
      const unhandledPropertiesInternalComments = uniq(
        [...(node.callProperties || []), ...(node.internalSlots || [])]
          .map((node) => [
            `ROBLOX TODO: Unhandled node for type: ${node.type}`,
            getNodeSource(source, node),
          ])
          .flat()
      );

      const intersectionTypes = Array<LuaType | undefined>(
        ...spreadProperties,
        objectTypeProperties.length ||
          indexProperties.length ||
          !spreadProperties.length ||
          unhandledPropertiesInternalComments.length
          ? withInnerConversionComment(
              typeLiteral([...objectTypeProperties, ...indexProperties]),
              ...unhandledPropertiesInternalComments
            )
          : undefined
      ).filter(isTruthy);

      return applyTo(
        intersectionTypes.length > 1
          ? typeIntersection(intersectionTypes)
          : intersectionTypes[0]
      )((resultNode) =>
        node.inexact
          ? withTrailingConversionComment(
              resultNode,
              "ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze"
            )
          : resultNode
      );
    }
  );
};
