import { Program } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { prependLeadingComments } from '@js-to-lua/lua-conversion-utils';
import { commentLine, LuaProgram, program } from '@js-to-lua/lua-types';
import { statementHandler } from '../expression-statement.handler';

export const handleProgram = createHandler<LuaProgram, Program>(
  'Program',
  (source, config: { upstreamPath?: string }, node) => {
    const body = Array.isArray(node.body) ? node.body : [node.body];
    const toStatement = statementHandler.handler(source, config);
    const prog = program(body.map(toStatement));

    return prependLeadingComments(
      prog,
      commentLine(
        config.upstreamPath
          ? ` ROBLOX upstream: ${config.upstreamPath}`
          : ' ROBLOX NOTE: no upstream'
      )
    );
  }
);
