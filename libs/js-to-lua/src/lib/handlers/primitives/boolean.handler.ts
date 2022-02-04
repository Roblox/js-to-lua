import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { BooleanLiteral } from '@babel/types';
import { booleanLiteral, LuaBooleanLiteral } from '@js-to-lua/lua-types';

export const handleBooleanLiteral: BaseNodeHandler<
  LuaBooleanLiteral,
  BooleanLiteral
> = createHandler('BooleanLiteral', (source, config, literal) =>
  booleanLiteral(literal.value)
);
