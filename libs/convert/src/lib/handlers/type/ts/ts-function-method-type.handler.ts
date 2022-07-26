import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { getReturnType } from '@js-to-lua/lua-conversion-utils';
import {
  functionParamName,
  functionTypeParamEllipse,
  LuaType,
  LuaTypeFunction,
  typeAny,
  typeFunction,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createRestElementHandler } from '../../rest-element.handler';
import { createTsTypeParameterDeclarationHandler } from './ts-type-parameter-declaration.handler';

export const createTsFunctionMethodTypeHandler = <
  T extends Babel.TSFunctionType | Babel.TSMethodSignature
>(
  handleIdentifier: IdentifierStrictHandlerFunction,
  typesHandlerFunction: HandlerFunction<LuaType, Babel.TSType>
) => {
  const restHandler = createRestElementHandler(typesHandlerFunction);
  return createHandler<LuaTypeFunction, T>(
    ['TSFunctionType', 'TSMethodSignature'],
    (source, config, node) => {
      const handleTsTypeParameterDeclaration =
        createTsTypeParameterDeclarationHandler(typesHandlerFunction).handler(
          source,
          config
        );
      const typeParameters = node.typeParameters
        ? handleTsTypeParameterDeclaration(node.typeParameters)
        : undefined;
      const parameters = node.parameters.map((param) => {
        if (Babel.isRestElement(param)) {
          return functionTypeParamEllipse(restHandler(source, config, param));
        }
        const paramId = handleIdentifier(source, config, param);
        const paramType = paramId.typeAnnotation?.typeAnnotation || typeAny();
        return functionParamName(paramId, paramType);
      });

      const returnType = node.typeAnnotation
        ? typesHandlerFunction(
            source,
            config,
            node.typeAnnotation.typeAnnotation
          )
        : typeAny();

      return typeFunction(
        parameters,
        getReturnType(returnType),
        typeParameters
      );
    }
  );
};
