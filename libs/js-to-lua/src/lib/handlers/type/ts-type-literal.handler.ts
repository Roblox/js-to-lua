import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  LuaExpression,
  LuaPropertySignature,
  LuaTypeAnnotation,
  LuaTypeLiteral,
  makeOptionalAnnotation,
  typeLiteral,
  typePropertySignature,
} from '@js-to-lua/lua-types';
import {
  Expression,
  Noop,
  TSPropertySignature,
  TSTypeAnnotation,
  TSTypeLiteral,
  TypeAnnotation,
} from '@babel/types';
import { combineHandlers } from '../../utils/combine-handlers';
import { defaultElementHandler } from '../../utils/default-handlers';
import { applyTo } from 'ramda';

export const createTsTypeLiteralHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) => {
  const handleTsPropertySignature: BaseNodeHandler<
    LuaPropertySignature,
    TSPropertySignature
  > = createHandler('TSPropertySignature', (source, config, node) =>
    typePropertySignature(
      expressionHandlerFunction(source, config, node.key),
      node.typeAnnotation
        ? applyTo(
            typesHandlerFunction(source, config, node.typeAnnotation),
            makeOptionalAnnotation(!!node.optional)
          )
        : undefined
    )
  );

  const handleTsTypeLiteral: BaseNodeHandler<
    LuaTypeLiteral,
    TSTypeLiteral
  > = createHandler('TSTypeLiteral', (source, config, node) =>
    typeLiteral(
      node.members.map(
        combineHandlers(
          [handleTsPropertySignature],
          defaultElementHandler
        ).handler(source, config)
      )
    )
  );

  return handleTsTypeLiteral;
};
