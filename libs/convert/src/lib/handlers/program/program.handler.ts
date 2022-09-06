import { Program } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { LuaProgram, program } from '@js-to-lua/lua-types';
import { statementHandler } from '../expression-statement.handler';
import { postProcess } from '../post-process';

export const handleProgram = createHandler<LuaProgram, Program>(
  'Program',
  (source, config, node) => {
    const body = Array.isArray(node.body) ? node.body : [node.body];
    const toStatement = statementHandler.handler(source, config);
    return postProcess(program(body.map(toStatement)));
  }
);
