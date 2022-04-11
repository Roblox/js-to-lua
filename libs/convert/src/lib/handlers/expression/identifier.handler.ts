import { Noop, TSTypeAnnotation, TypeAnnotation } from '@babel/types';
import {
  createHandler,
  CreateHandlerFunctionOptions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  createWithAlternativeExpressionExtras,
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
  stringLiteral,
  typeAnnotation,
  typeAny,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import {
  IdentifierHandler,
  IdentifierHandlerFrom,
  IdentifierHandlerTo,
  IdentifierStrictHandler,
  IdentifierStrictHandlerFrom,
  IdentifierStrictHandlerTo,
} from './identifier-handler-types';

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
      const withOriginalIdentifierNameExtras =
        createWithOriginalIdentifierNameExtras(node.name);
      const withAlternativeStringLiteral =
        createWithAlternativeExpressionExtras(stringLiteral(node.name));

      switch (node.name) {
        case 'and':
        case 'break':
        case 'do':
        case 'else':
        case 'elseif':
        case 'end':
        case 'false':
        case 'for':
        case 'function':
        case 'if':
        case 'in':
        case 'local':
        case 'nil':
        case 'not':
        case 'or':
        case 'repeat':
        case 'return':
        case 'then':
        case 'true':
        case 'until':
        case 'while':
          return withAlternativeStringLiteral(
            withOriginalIdentifierNameExtras(identifier(`${node.name}_`))
          );
        case 'error':
        case 'table':
          return withOriginalIdentifierNameExtras(identifier(`${node.name}_`));
        default: {
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

          return !isValidIdentifier(node.name)
            ? withTrailingConversionComment(
                withOriginalIdentifierNameExtras(
                  identifier(toValidIdentifier(node.name), annotation)
                ),
                `ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: ${getNodeSource(
                  source,
                  node
                )}`
              )
            : identifier(node.name, annotation);
        }
      }
    },
    options
  );
