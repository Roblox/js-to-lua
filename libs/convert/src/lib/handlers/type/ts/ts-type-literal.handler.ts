import {
  Expression,
  FlowType,
  isTSIndexSignature,
  TSType,
  TSTypeAnnotation,
  TSTypeLiteral,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaType,
  LuaTypeAnnotation,
  LuaTypeIntersection,
  LuaTypeLiteral,
  LuaTypeUnion,
  typeIntersection,
  typeLiteral,
  typeUnion,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsTypeElementHandler } from './ts-type-element.handler';

export const createTsTypeLiteralHandler = (
  handleIdentifier: IdentifierHandlerFunction,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeAnnotationHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TSTypeAnnotation
  >,
  typesHandlerFunction: HandlerFunction<LuaType, TSType | FlowType>
) => {
  const typeElementHandler = createTsTypeElementHandler(
    handleIdentifier,
    expressionHandlerFunction,
    typeAnnotationHandlerFunction,
    typesHandlerFunction
  );

  const handleTsTypeLiteral = createHandler<
    LuaTypeLiteral | LuaTypeUnion | LuaTypeIntersection,
    TSTypeLiteral
  >('TSTypeLiteral', (source, config, node) => {
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
