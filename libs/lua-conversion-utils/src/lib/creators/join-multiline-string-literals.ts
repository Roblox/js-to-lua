import {
  LuaMultilineStringLiteral,
  multilineStringLiteral,
} from '@js-to-lua/lua-types';
import { reassignComments } from '../comment';

export const joinMultilineStringLiterals =
  (separator: string) =>
  (first: LuaMultilineStringLiteral, ...rest: LuaMultilineStringLiteral[]) =>
    reassignComments(
      multilineStringLiteral(
        [
          first.value,
          ...rest.map(({ value }) => value.replace(/^\n/, '')),
        ].join(separator)
      ),
      first,
      ...rest
    );
