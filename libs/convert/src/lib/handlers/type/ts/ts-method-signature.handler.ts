import * as Babel from '@babel/types';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionTypeParam,
  identifier,
  isIdentifier,
  isStringLiteral,
  LuaExpression,
  LuaIdentifier,
  LuaPropertySignature,
  LuaType,
  typeAnnotation,
  typeAny,
  typePropertySignature,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { IdentifierHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsFunctionMethodTypeHandler } from './ts-function-method-type.handler';

export const createTsMethodSignatureHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>,
  typesHandlerFunction: HandlerFunction<LuaType, Babel.TSType | Babel.FlowType>
) => {
  const handleMethodType =
    createTsFunctionMethodTypeHandler<Babel.TSMethodSignature>(
      handleIdentifier,
      typesHandlerFunction
    ).handler;

  return createHandler<
    LuaPropertySignature,
    Babel.TSMethodSignature,
    { typeId?: LuaIdentifier }
  >('TSMethodSignature', (source, config, node) => {
    const key = expressionHandlerFunction(source, config, node.key);

    const rightSideType = handleMethodType(source, config, node);

    rightSideType.parameters.unshift(
      functionTypeParam(
        identifier('self'),
        config.typeId ? typeReference(config.typeId) : typeAny()
      )
    );

    const rightSide = typeAnnotation(rightSideType);

    return isIdentifier(key) || isStringLiteral(key)
      ? typePropertySignature(key, rightSide)
      : typePropertySignature(
          withTrailingConversionComment(
            typeString(),
            `ROBLOX TODO: unhandled node for type: TSMethodSignature with key of type ${node.key.type}`,
            getNodeSource(source, node.key)
          ),
          rightSide
        );
  });
};
