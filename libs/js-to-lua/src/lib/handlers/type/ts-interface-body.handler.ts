import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  LuaExpression,
  LuaTypeAnnotation,
  LuaTypeLiteral,
  typeLiteral,
} from '@js-to-lua/lua-types';
import {
  Expression,
  Noop,
  TSInterfaceBody,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { createTsTypeElementHandler } from './ts-type-element.handler';

export const createTsInterfaceBodyHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) => {
  const typeElementHandler = createTsTypeElementHandler(
    expressionHandlerFunction,
    typesHandlerFunction
  );

  const handleTsTypeLiteral: BaseNodeHandler<
    LuaTypeLiteral,
    TSInterfaceBody
  > = createHandler('TSInterfaceBody', (source, config, node) =>
    typeLiteral(node.body.map(typeElementHandler.handler(source, config)))
  );

  return handleTsTypeLiteral;
};
