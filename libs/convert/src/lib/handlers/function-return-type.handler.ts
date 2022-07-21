import {
  TypeAnnotation,
  TSTypeAnnotation,
  Noop,
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
  ObjectMethod,
  ClassMethod,
  TSDeclareMethod,
  ClassPrivateMethod,
} from '@babel/types';
import {
  HandlerFunction,
  createOptionalHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getReturnType,
  reassignComments,
} from '@js-to-lua/lua-conversion-utils';
import { LuaFunctionReturnType, LuaTypeAnnotation } from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';

export const createFunctionReturnTypeHandler = (
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) =>
  createOptionalHandlerFunction<
    LuaFunctionReturnType,
    | FunctionDeclaration
    | FunctionExpression
    | ArrowFunctionExpression
    | ObjectMethod
    | ClassMethod
    | ClassPrivateMethod
    | TSDeclareMethod
  >((source, config, node) => {
    return node.returnType
      ? applyTo(
          handleTypeAnnotation(source, config, node.returnType),
          pipe(
            (typeAnnotationNode: LuaTypeAnnotation) =>
              reassignComments(
                typeAnnotationNode.typeAnnotation,
                typeAnnotationNode
              ),
            getReturnType
          )
        )
      : undefined;
  });
