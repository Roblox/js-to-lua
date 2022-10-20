import { Identifier } from '@babel/types';
import { createOptionalHandlerFunction } from '@js-to-lua/handler-utils';
import {
  createWithOriginalIdentifierNameExtras,
  luauGlobalIdentifiers,
  robloxGlobalIdentifiers,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';

export const createGlobalLuaIdentifierOptionalHandler = () => {
  return createOptionalHandlerFunction<LuaIdentifier, Identifier>(
    (source, config, node) => {
      if (
        luauGlobalIdentifiers.includes(node.name) ||
        robloxGlobalIdentifiers.includes(node.name)
      ) {
        const withOriginalIdentifierNameExtras =
          createWithOriginalIdentifierNameExtras(node.name);
        return withOriginalIdentifierNameExtras(identifier(`${node.name}_`));
      }
    }
  );
};
