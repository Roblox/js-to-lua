import {
  Noop,
  TSIndexSignature,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  isTypeNumber,
  isTypeString,
  LuaIndexSignature,
  LuaTypeAnnotation,
  typeAnnotation,
  typeAny,
  typeIndexSignature,
  typeString,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import { getNodeSource } from '../../utils/get-node-source';

export const createTsIndexSignatureHandler = (
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) => {
  const handleTsIndexSignature: BaseNodeHandler<
    LuaIndexSignature,
    TSIndexSignature
  > = createHandler('TSIndexSignature', (source, config, node) => {
    // This scenarios lead to invalid TypeScript, Babel parser should fail earlier. Handling is added because type creators allow it.
    if (node.parameters.length !== 1) {
      return withTrailingConversionComment(
        typeIndexSignature(typeString(), typeAnnotation(typeAny())),
        'Multiple or no parameters are not handled for TSIndexSignature',
        getNodeSource(source, node)
      );
    }

    if (!node.parameters[0].typeAnnotation) {
      return withTrailingConversionComment(
        typeIndexSignature(typeString(), typeAnnotation(typeAny())),
        'Node parameter typeAnnotation is required for TSIndexSignature',
        getNodeSource(source, node)
      );
    }

    if (!node.typeAnnotation) {
      return withTrailingConversionComment(
        typeIndexSignature(typeString(), typeAnnotation(typeAny())),
        'TSIndexSignature typeAnnotation is required',
        getNodeSource(source, node)
      );
    }

    const handledTypeAnnotation = typesHandlerFunction(
      source,
      config,
      node.parameters[0].typeAnnotation
    );

    if (
      !isTypeString(handledTypeAnnotation.typeAnnotation) &&
      !isTypeNumber(handledTypeAnnotation.typeAnnotation)
    ) {
      return typeIndexSignature(
        withTrailingConversionComment(
          typeString(),
          'TSIndexSignature parameter type must be string or number.',
          getNodeSource(source, node.parameters[0])
        ),
        typesHandlerFunction(source, config, node.typeAnnotation)
      );
    }

    return typeIndexSignature(
      // IndexSignature parameter must have a type annotation, and only 1 parameter.
      handledTypeAnnotation.typeAnnotation,
      // IndexSignature must have a type annotation
      typesHandlerFunction(source, config, node.typeAnnotation)
    );
  });

  return handleTsIndexSignature;
};
