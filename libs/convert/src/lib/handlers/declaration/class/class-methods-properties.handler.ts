import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getReturnType,
  reassignComments,
  removeTypeAnnotation,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionParamName,
  identifier,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaPropertySignature,
  LuaType,
  LuaTypeAnnotation,
  typeAnnotation,
  typeAny,
  typeFunction,
  typePropertySignature,
  typeReference,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { createFunctionTypeParamsHandler } from '../../function-params.handler';
import { inferType } from '../../type/infer-type';

export const createHandleMethodsAndProperties = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const functionTypeParamsHandler = createFunctionTypeParamsHandler(
    handleIdentifier,
    handleTypeAnnotation,
    handleType
  );

  return createHandlerFunction<
    LuaPropertySignature,
    Babel.ClassMethod | Babel.TSDeclareMethod | Babel.ClassProperty,
    { classIdentifier: LuaIdentifier }
  >((source, config, node) => {
    return typePropertySignature(
      removeTypeAnnotation(handleExpression(source, config, node.key)),
      handleClassMethodOrPropertyTypeAnnotation(node)
    );

    function handleClassMethodOrPropertyTypeAnnotation(
      node: Babel.ClassMethod | Babel.TSDeclareMethod | Babel.ClassProperty
    ): LuaTypeAnnotation {
      if (Babel.isClassMethod(node) || Babel.isTSDeclareMethod(node)) {
        const fnParams = functionTypeParamsHandler(
          source,
          config as EmptyConfig,
          node
        );

        const returnType = node.returnType
          ? applyTo(
              handleTypeAnnotation(source, config, node.returnType),
              (typeAnnotationNode) =>
                reassignComments(
                  typeAnnotationNode.typeAnnotation,
                  typeAnnotationNode
                )
            )
          : typeAny();

        return typeAnnotation(
          typeFunction(
            [
              functionParamName(
                identifier('self'),
                typeReference(config.classIdentifier)
              ),
              ...fnParams,
            ],
            returnType && getReturnType(returnType)
          )
        );
      }

      return node.typeAnnotation
        ? handleTypeAnnotation(source, config, node.typeAnnotation)
        : node.value
        ? typeAnnotation(inferType(node.value))
        : typeAnnotation(typeAny());
    }
  });
};
