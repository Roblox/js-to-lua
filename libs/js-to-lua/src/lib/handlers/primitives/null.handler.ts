import { BaseNodeHandler, createHandler } from '../../types';
import { NullLiteral } from '@babel/types';
import { LuaNilLiteral, nilLiteral } from '@js-to-lua/lua-types';

export const handleNullLiteral: BaseNodeHandler<
  NullLiteral,
  LuaNilLiteral
> = createHandler('NullLiteral', () => nilLiteral());
