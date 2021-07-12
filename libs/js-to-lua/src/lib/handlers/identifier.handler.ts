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
} from '@js-to-lua/lua-types';
import {
  Identifier,
  Noop,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';

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
        return {
          type: 'Identifier',
          name: `${node.name}_`,
        };
      default:
        return {
          type: 'Identifier',
          name: node.name,
          ...(node.typeAnnotation
            ? {
                typeAnnotation: handleType(source, config, node.typeAnnotation),
              }
            : {}),
        };
    }
  });
