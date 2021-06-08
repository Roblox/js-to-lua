import { BaseNodeHandler, createHandler } from '../../types';
import { StringLiteral } from '@babel/types';
import { LuaStringLiteral } from '@js-to-lua/lua-types';

export const handleStringLiteral: BaseNodeHandler<
  StringLiteral,
  LuaStringLiteral
> = createHandler('StringLiteral', (source, literal) => ({
  type: 'StringLiteral',
  value: literal.value,
}));
