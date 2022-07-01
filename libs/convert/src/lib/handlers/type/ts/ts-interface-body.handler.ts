import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeLiteral,
  typeLiteral,
} from '@js-to-lua/lua-types';
import {
  Expression,
  FlowType,
  Noop,
  TSInterfaceBody,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { createTsTypeElementHandler } from './ts-type-element.handler';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';

export const createTsInterfaceBodyHandler = (
  handleIdentifier: IdentifierStrictHandlerFunction,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeAnnotationHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  typesHandlerFunction: HandlerFunction<LuaType, TSType | FlowType>
) => {
  const typeElementHandler = createTsTypeElementHandler(
    handleIdentifier,
    expressionHandlerFunction,
    typeAnnotationHandlerFunction,
    typesHandlerFunction
  );

  const handleTsTypeLiteral: BaseNodeHandler<LuaTypeLiteral, TSInterfaceBody> =
    createHandler('TSInterfaceBody', (source, config, node) =>
      typeLiteral(node.body.map(typeElementHandler.handler(source, config)))
    );

  return handleTsTypeLiteral;
};
