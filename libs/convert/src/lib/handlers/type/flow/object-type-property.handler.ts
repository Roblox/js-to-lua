import {
  FlowType,
  isIdentifier as isBabelIdentifier,
  ObjectTypeProperty,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaType,
  LuaTypeElement,
  makeOptionalAnnotation,
  typeAnnotation,
  typePropertySignature,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createStringLiteralHandler } from '../../primitives/string.handler';

export const createObjectTypePropertyHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  const handleStringLiteral = createStringLiteralHandler().handler;

  return createHandlerFunction<LuaTypeElement, ObjectTypeProperty>(
    (source, config, node) => {
      const key = isBabelIdentifier(node.key)
        ? handleIdentifierStrict(source, config, node.key)
        : handleStringLiteral(source, config, node.key);

      const annotation = makeOptionalAnnotation(node.optional)(
        typeAnnotation(handleFlowType(source, config, node.value))
      );

      return typePropertySignature(key, annotation);
    }
  );
};
