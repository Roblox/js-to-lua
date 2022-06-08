import { AsStatementReturnValue } from '@js-to-lua/lua-conversion-utils';
import {
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';

export type SingleFieldTableConstructorToReturn = AsStatementReturnValue<
  LuaStatement,
  LuaTableConstructor<[LuaTableKeyField]>
>;

export const extractTableConstructorField = ({
  toReturn: {
    elements: [field],
  },
}: SingleFieldTableConstructorToReturn) => field;
