import { Program } from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { LuaProgram } from '@js-to-lua/lua-types';
import { statementHandler } from '../expression-statement.handler';
import { postProcess } from '../post-process';

export const handleProgram: BaseNodeHandler<LuaProgram, Program> =
  createHandler('Program', (source, config, program) => {
    const body = Array.isArray(program.body) ? program.body : [program.body];
    const toStatement = statementHandler.handler(source, config);
    return postProcess({
      type: 'Program',
      body: body.map(toStatement),
    });
  });
