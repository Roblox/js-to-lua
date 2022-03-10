import {
  Expression,
  Identifier,
  Noop,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  combineTypeAnnotationHandlers,
  defaultTypeHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaIdentifier,
  LuaTypeAnnotation,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { createFlowTypeHandler } from './flow/flow-type.handler';
import { createFlowTypeAnnotationHandler } from './flow/type-annotation.handler';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';

export const createTypeAnnotationHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  identifierHandlerFunction: HandlerFunction<LuaIdentifier, Identifier>
) => {
  // TODO: move handlers to their own files
  const handleNoop: BaseNodeHandler<LuaTypeAnnotation, Noop> = createHandler(
    'Noop',
    () => typeAnnotation(typeAny())
  );

  const { handleTsTypeAnnotation, handleTsTypes } =
    createTsTypeAnnotationHandler(
      expressionHandlerFunction,
      identifierHandlerFunction
    );

  const handleFlowTypes = createFlowTypeHandler();

  const handleFlowTypeAnnotation = createFlowTypeAnnotationHandler(
    handleFlowTypes.handler
  );

  const typesHandler = combineTypeAnnotationHandlers<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

  const handleTypes = combineHandlers(
    [handleTsTypes, handleFlowTypes],
    defaultTypeHandler
  );

  return {
    typesHandler,
    handleTypes,
  };
};
