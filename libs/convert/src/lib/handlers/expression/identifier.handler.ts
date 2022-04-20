import { Noop, TSTypeAnnotation, TypeAnnotation } from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  createHandler,
  CreateHandlerFunctionOptions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  createWithOriginalIdentifierNameExtras,
  getNodeSource,
  isValidIdentifier,
  toValidIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  identifier,
  LuaTypeAnnotation,
  makeOptionalAnnotation,
  memberExpression,
  nilLiteral,
  numericLiteral,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { createGlobalLuaIdentifierOptionalHandler } from './identifier-global-lua.handler';
import {
  IdentifierHandler,
  IdentifierHandlerFrom,
  IdentifierHandlerTo,
  IdentifierStrictHandler,
  IdentifierStrictHandlerFrom,
  IdentifierStrictHandlerTo,
} from './identifier-handler-types';
import { createReservedKeywordIdentifierOptionalHandler } from './identifier-reserved-keyword.handler';

export const createIdentifierHandler = (
  handleType: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
): IdentifierHandler =>
  createHandler<IdentifierHandlerTo, IdentifierHandlerFrom>(
    'Identifier',
    (source, config, node) => {
      const strictIdentifierHandler = createIdentifierStrictHandler(
        handleType,
        { skipComments: true }
      ).handler;

      switch (node.name) {
        case 'undefined':
          return nilLiteral();
        case 'Infinity':
          return memberExpression(identifier('math'), '.', identifier('huge'));
        case 'NaN':
          return binaryExpression(numericLiteral(0), '/', numericLiteral(0));
        default: {
          return strictIdentifierHandler(source, config, node);
        }
      }
    }
  );

export const createIdentifierStrictHandler = (
  handleType: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  options?: CreateHandlerFunctionOptions
): IdentifierStrictHandler =>
  createHandler<IdentifierStrictHandlerTo, IdentifierStrictHandlerFrom>(
    'Identifier',
    (source, config, node) => {
      const resultIdentifier = combineOptionalHandlerFunctions([
        createReservedKeywordIdentifierOptionalHandler(),
        createGlobalLuaIdentifierOptionalHandler(),
      ])(source, config, node);

      if (resultIdentifier) {
        return resultIdentifier;
      }

      const optional = !!node.optional;
      const annotation =
        node.typeAnnotation || optional
          ? applyTo(
              node.typeAnnotation
                ? handleType(source, config, node.typeAnnotation)
                : typeAnnotation(typeAny()),
              makeOptionalAnnotation(optional)
            )
          : undefined;

      const withOriginalIdentifierNameExtras =
        createWithOriginalIdentifierNameExtras(node.name);

      return isValidIdentifier(node.name)
        ? identifier(node.name, annotation)
        : withTrailingConversionComment(
            withOriginalIdentifierNameExtras(
              identifier(toValidIdentifier(node.name), annotation)
            ),
            `ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: ${getNodeSource(
              source,
              node
            )}`
          );
    },
    options
  );
