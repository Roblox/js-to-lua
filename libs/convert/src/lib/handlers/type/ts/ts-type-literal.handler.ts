import * as Babel from '@babel/types';
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
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>,
  typeAnnotationHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TSTypeAnnotation
  >,
  typesHandlerFunction: HandlerFunction<LuaType, Babel.TSType | Babel.FlowType>
) => {
  const typeElementHandler = createTsTypeElementHandler(
    handleIdentifier,
    expressionHandlerFunction,
    typeAnnotationHandlerFunction,
    typesHandlerFunction
  );

  const handleTsTypeLiteral = createHandler<
    LuaTypeLiteral | LuaTypeUnion | LuaTypeIntersection,
    Babel.TSTypeLiteral
  >('TSTypeLiteral', (source, config, node) => {
    const indexSignatures = node.members.filter(
      (member): member is Babel.TSIndexSignature =>
        Babel.isTSIndexSignature(member)
    );
    const nonIndexSignatures = node.members.filter(
      (
        member
      ): member is Exclude<Babel.TSTypeElement, Babel.TSIndexSignature> =>
        !Babel.isTSIndexSignature(member)
    );

    if (indexSignatures.length > 1) {
      const indexSignaturesUnion = typeUnion([
        ...indexSignatures.map((signature) =>
          typeLiteral([typeElementHandler.handler(source, config, signature)])
        ),
      ]);
      if (nonIndexSignatures.length > 0) {
        return typeIntersection([
          indexSignaturesUnion,
          typeLiteral(
            nonIndexSignatures.map(typeElementHandler.handler(source, config))
          ),
        ]);
      }
      return indexSignaturesUnion;
    }

    return typeLiteral(
      node.members.map(typeElementHandler.handler(source, config))
    );
  });

  return handleTsTypeLiteral;
};
