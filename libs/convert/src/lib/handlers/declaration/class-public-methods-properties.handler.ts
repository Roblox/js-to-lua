import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  reassignComments,
  removeIdTypeAnnotation,
  removeTypeAnnotation,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionTypeParam,
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
import { createFunctionParamsHandler } from '../function-params.handler';
import { inferType } from '../type/infer-type';

export const createHandlePublicMethodsAndProperties = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const functionParamsHandler = createFunctionParamsHandler(
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
        const fnParams = functionParamsHandler(
          source,
          config as EmptyConfig,
          node
        ).map((param) =>
          functionTypeParam(
            removeIdTypeAnnotation(param),
            param.typeAnnotation
              ? param.typeAnnotation.typeAnnotation
              : typeAny()
          )
        );

        return typeAnnotation(
          typeFunction(
            [
              functionTypeParam(
                identifier('self'),
                typeReference(config.classIdentifier)
              ),
              ...fnParams,
            ],
            node.returnType
              ? applyTo(
                  handleTypeAnnotation(source, config, node.returnType),
                  (typeAnnotationNode) =>
                    reassignComments(
                      typeAnnotationNode.typeAnnotation,
                      typeAnnotationNode
                    )
                )
              : typeAny()
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