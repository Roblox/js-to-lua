import {
  Expression,
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
  LuaTypeAnnotation,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createFlowTypeHandler } from './flow/flow-type.handler';
import { createFlowTypeAnnotationHandler } from './flow/type-annotation.handler';
import { createTsTypeAnnotationHandler } from './ts-type-annotation.handler';

export const createTypeAnnotationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  // TODO: move handlers to their own files
  const handleNoop: BaseNodeHandler<LuaTypeAnnotation, Noop> = createHandler(
    'Noop',
    () => typeAnnotation(typeAny())
  );

  const { handleTsTypeAnnotation, handleTsTypes } =
    createTsTypeAnnotationHandler(handleExpression, handleIdentifierStrict);

  const handleFlowTypes = createFlowTypeHandler(handleIdentifierStrict);

  const handleFlowTypeAnnotation = createFlowTypeAnnotationHandler(
    handleFlowTypes.handler
  );

  const handleTypeAnnotation = combineTypeAnnotationHandlers<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >([handleTsTypeAnnotation, handleFlowTypeAnnotation, handleNoop]).handler;

  const handleType = combineHandlers(
    [handleTsTypes, handleFlowTypes],
    defaultTypeHandler
  );

  return {
    handleTypeAnnotation,
    handleType,
  };
};
