import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import {
  binaryExpression,
  identifier,
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaTypeAnnotation,
  memberExpression,
  nilLiteral,
  numericLiteral,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  Identifier,
  Noop,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { getNodeSource } from '../utils/get-node-source';
import {
  isValidIdentifier,
  toValidIdentifier,
} from '../utils/valid-identifier';
import { createWithOriginalIdentifierNameExtras } from '../utils/with-original-identifier-name-extras';

export const createIdentifierHandler = (
  handleType: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
): BaseNodeHandler<
  LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
  Identifier
> =>
  createHandler('Identifier', (source, config, node) => {
    const withOriginalIdentifierNameExtras = createWithOriginalIdentifierNameExtras(
      node.name
    );
    switch (node.name) {
      case 'undefined':
        return nilLiteral();
      case 'Infinity':
        return memberExpression(identifier('math'), '.', identifier('huge'));
      case 'NaN':
        return binaryExpression(numericLiteral(0), '/', numericLiteral(0));
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
      case 'error':
        return withOriginalIdentifierNameExtras(identifier(`${node.name}_`));
      default: {
        const typeAnnotation =
          (node.typeAnnotation &&
            handleType(source, config, node.typeAnnotation)) ||
          undefined;

        return !isValidIdentifier(node.name)
          ? withTrailingConversionComment(
              identifier(toValidIdentifier(node.name), typeAnnotation),
              `ROBLOX CHECK: replaced unhandled characters in identifier. Original identifier: ${getNodeSource(
                source,
                node
              )}`
            )
          : identifier(node.name, typeAnnotation);
      }
    }
  });
