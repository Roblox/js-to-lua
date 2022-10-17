import {
  isNumericLiteral,
  isTSLiteralType,
  isTSNumberKeyword,
  TSType,
  TSUnionType,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType, typeNumber, typeUnion } from '@js-to-lua/lua-types';
import { uniqWith } from 'ramda';

export const createTsTypeUnionHandler = (
  handleTsType: HandlerFunction<LuaType, TSType>
) =>
  createHandler<LuaType, TSUnionType>('TSUnionType', (source, config, node) => {
    const isNumericLiteralOrNumber = (node: TSType) =>
      (isTSLiteralType(node) && isNumericLiteral(node.literal)) ||
      isTSNumberKeyword(node);

    return typeUnion(
      uniqWith(
        (a, b) => isNumericLiteralOrNumber(a) && isNumericLiteralOrNumber(b),
        node.types
      ).map((x) =>
        isNumericLiteralOrNumber(x)
          ? typeNumber()
          : handleTsType(source, config, x)
      )
    );
  });
