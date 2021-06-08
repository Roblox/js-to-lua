import { BaseNodeHandler, createHandler } from '../../types';
import { BooleanLiteral } from '@babel/types';
import { booleanLiteral, LuaBooleanLiteral } from '@js-to-lua/lua-types';

export const handleBooleanLiteral: BaseNodeHandler<
  BooleanLiteral,
  LuaBooleanLiteral
> = createHandler('BooleanLiteral', (source, literal) =>
  booleanLiteral(literal.value)
);
