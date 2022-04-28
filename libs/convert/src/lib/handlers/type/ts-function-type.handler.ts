import {
  isRestElement as isRestElement_,
  RestElement,
  TSFunctionType,
  TSType,
} from '@babel/types';
import {
  BabelNode,
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  functionTypeParam,
  LuaType,
  LuaTypeFunction,
  typeAny,
  typeFunction,
  typeVariadicFunction,
} from '@js-to-lua/lua-types';
import { last } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createRestElementHandler } from '../rest-element.handler';
import { createTsTypeParameterDeclarationHandler } from './ts-type-parameter-declaration.handler';

export const createTsFunctionTypeHandler = (
  handleIdentifier: IdentifierStrictHandlerFunction,
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) => {
  const restHandler = createRestElementHandler(typesHandlerFunction);
  const handleTsTypeFunction: BaseNodeHandler<LuaTypeFunction, TSFunctionType> =
    createHandler('TSFunctionType', (source, config, node) => {
      const isNotRestElement = <N extends BabelNode>(
        obj: N
      ): obj is Exclude<N, RestElement> => !isRestElement_(obj);
      const isRestElement = (
        // eslint-disable-next-line @typescript-eslint/ban-types
        obj: object | null | undefined
      ): obj is RestElement => isRestElement_(obj);

      const handleTsTypeParameterDeclaration =
        createTsTypeParameterDeclarationHandler(typesHandlerFunction).handler(
          source,
          config
        );
      const typeParameters = node.typeParameters
        ? handleTsTypeParameterDeclaration(node.typeParameters)
        : undefined;
      const nonRestParams = node.parameters.filter(isNotRestElement);
      const restParam = last(node.parameters.filter(isRestElement));
      const parameters = nonRestParams.map((param) => {
        const paramId = handleIdentifier(source, config, param);
        const paramType = paramId.typeAnnotation?.typeAnnotation || typeAny();
        return functionTypeParam(paramId, paramType);
      });

      const returnType = node.typeAnnotation
        ? typesHandlerFunction(
            source,
            config,
            node.typeAnnotation.typeAnnotation
          )
        : typeAny();

      return restParam
        ? typeVariadicFunction(
            parameters,
            restHandler(source, config, restParam),
            returnType,
            typeParameters
          )
        : typeFunction(parameters, returnType, typeParameters);
    });

  return handleTsTypeFunction;
};
