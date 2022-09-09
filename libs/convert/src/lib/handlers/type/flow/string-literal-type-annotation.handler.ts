import * as Babel from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  literalType,
  LuaLiteralType,
  stringLiteral,
} from '@js-to-lua/lua-types';

export const createStringLiteralTypeAnnotationHandler = () =>
  createHandler<LuaLiteralType, Babel.StringLiteralTypeAnnotation>(
    'StringLiteralTypeAnnotation',
    (source, config, node) => {
      return literalType(stringLiteral(node.value));
    }
  );
