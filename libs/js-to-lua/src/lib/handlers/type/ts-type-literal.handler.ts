import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaTypeAnnotation,
  LuaTypeIntersection,
  LuaTypeLiteral,
  LuaTypeUnion,
  typeIntersection,
  typeLiteral,
  typeUnion,
} from '@js-to-lua/lua-types';
import {
  Expression,
  isTSIndexSignature,
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

  const handleTsTypeLiteral: BaseNodeHandler<
    LuaTypeLiteral | LuaTypeUnion | LuaTypeIntersection,
    TSTypeLiteral
  > = createHandler('TSTypeLiteral', (source, config, node: TSTypeLiteral) => {
    const indexSignatures = node.members.filter((member) =>
      isTSIndexSignature(member)
    );
    const nonIndexSignatures = node.members.filter(
      (member) => !isTSIndexSignature(member)
    );

    if (indexSignatures.length > 1 && nonIndexSignatures.length) {
      return typeIntersection([
        typeUnion([
          ...indexSignatures.map((signature) =>
            typeLiteral([typeElementHandler.handler(source, config, signature)])
          ),
        ]),
        typeLiteral(
          nonIndexSignatures.map(typeElementHandler.handler(source, config))
        ),
      ]);
    }

    if (indexSignatures.length > 1) {
      return typeUnion([
        ...indexSignatures.map((signature) =>
          typeLiteral([typeElementHandler.handler(source, config, signature)])
        ),
      ]);
    }

    return typeLiteral(
      node.members.map(typeElementHandler.handler(source, config))
    );
  });

  return handleTsTypeLiteral;
};
