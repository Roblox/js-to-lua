import { BaseNodeHandler, createHandler } from '../../types';
import { NullLiteral } from '@babel/types';
import { LuaNilLiteral } from '@js-to-lua/lua-types';

export const handleNullLiteral: BaseNodeHandler<
  NullLiteral,
  LuaNilLiteral
> = createHandler('NullLiteral', () => ({
  type: 'NilLiteral',
}));
