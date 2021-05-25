import { BaseNodeHandler } from '../../types';
import { Program } from '@babel/types';
import { handleStatement } from '../expression-statement.handler';
import { LuaProgram } from '../../lua-nodes.types';

export const handleProgram: BaseNodeHandler<Program, LuaProgram> = {
  type: 'Program',
  handler: (program) => {
    const body = Array.isArray(program.body) ? program.body : [program.body];

    return {
      type: 'Program',
      body: body.map(handleStatement.handler),
    };
  },
};
