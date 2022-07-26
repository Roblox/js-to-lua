import {
  FlowType,
  FunctionTypeAnnotation,
  FunctionTypeParam,
  isArrayTypeAnnotation,
  isGenericTypeAnnotation,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionParamName,
  functionReturnType,
  functionTypeParamEllipse,
  LuaType,
  LuaTypeFunction,
  typeAny,
  typeFunction,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFlowTypeParameterDeclarationHandler } from './flow-type-parameter-declaration.handler';

export const createFunctionTypeAnnotationHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  const handleTsTypeFunction: BaseNodeHandler<
    LuaTypeFunction,
    FunctionTypeAnnotation
  > = createHandler('FunctionTypeAnnotation', (source, config, node) => {
    const handleFlowTypeParameterDeclaration =
      createFlowTypeParameterDeclarationHandler(handleFlowType).handler(
        source,
        config
      );

    const handleFunctionParam = (functionParam: FunctionTypeParam) => {
      return functionParamName(
        functionParam.name
          ? handleIdentifierStrict(source, config, functionParam.name)
          : null,
        handleFlowType(source, config, functionParam.typeAnnotation)
      );
    };

    const handleRestFunctionParam = (node: FunctionTypeParam) => {
      if (isArrayTypeAnnotation(node.typeAnnotation)) {
        return handleFlowType(source, config, node.typeAnnotation.elementType);
      }

      if (
        isGenericTypeAnnotation(node.typeAnnotation) &&
        isBabelIdentifier(node.typeAnnotation.id) &&
        node.typeAnnotation.id.name === 'Array' &&
        node.typeAnnotation.typeParameters?.params?.length === 1
      ) {
        return handleFlowType(
          source,
          config,
          node.typeAnnotation.typeParameters.params[0]
        );
      }

      return withTrailingConversionComment(
        typeAny(),
        ` ROBLOX CHECK: check correct type of elements. Upstream type: <${getNodeSource(
          source,
          node.typeAnnotation
        )}>`
      );
    };

    const typeParameters =
      node.typeParameters && node.typeParameters.params.length
        ? handleFlowTypeParameterDeclaration(node.typeParameters)
        : undefined;
    const params = node.params.map(handleFunctionParam);
    const returnType = handleFlowType(source, config, node.returnType);
    return node.rest
      ? typeFunction(
          [
            ...params,
            functionTypeParamEllipse(handleRestFunctionParam(node.rest)),
          ],
          functionReturnType([returnType]),
          typeParameters
        )
      : typeFunction(params, functionReturnType([returnType]), typeParameters);
  });

  return handleTsTypeFunction;
};
