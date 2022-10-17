import { isIdentifier as isBabelIdentifier, TSTypeQuery } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandler } from '@js-to-lua/lua-conversion-utils';
import { LuaType, typeQuery } from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';

export const createTsTypeQueryHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) =>
  createHandler<LuaType, TSTypeQuery>('TSTypeQuery', (source, config, node) => {
    const exprName = node.exprName;
    return typeQuery(
      isBabelIdentifier(exprName)
        ? handleIdentifierStrict(source, config, exprName)
        : defaultUnhandledIdentifierHandler(source, config, exprName)
    );
  });
