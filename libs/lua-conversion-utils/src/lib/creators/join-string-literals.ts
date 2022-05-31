import { LuaStringLiteral, stringLiteral } from '@js-to-lua/lua-types';
import { reassignComments } from '../comment';

export const joinStringLiterals =
  (separator: string) =>
  (first: LuaStringLiteral, ...rest: LuaStringLiteral[]) =>
    reassignComments(
      stringLiteral([first, ...rest].map(({ value }) => value).join(separator)),
      first,
      ...rest
    );
