import { BaseNodeHandler, createHandler } from '../../types';
import { Program } from '@babel/types';
import { handleStatement } from '../expression-statement.handler';
import { LuaProgram } from '@js-to-lua/lua-types';

export const handleProgram: BaseNodeHandler<
  LuaProgram,
  Program
> = createHandler('Program', (source, program) => {
  const body = Array.isArray(program.body) ? program.body : [program.body];

  return {
    type: 'Program',
    body: body.map(handleStatement.handler(source)),
  };
});
