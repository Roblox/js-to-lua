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
  TSTypeAnnotation,
  TSTypeLiteral,
  TypeAnnotation,
} from '@babel/types';
import { createTsTypeElementHandler } from './ts-type-element.handler';

export const createTsTypeLiteralHandler = (
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

  const handleTsTypeLiteral: BaseNodeHandler<LuaTypeLiteral, TSTypeLiteral> =
    createHandler('TSTypeLiteral', (source, config, node) =>
      typeLiteral(node.members.map(typeElementHandler.handler(source, config)))
    );

  return handleTsTypeLiteral;
};
