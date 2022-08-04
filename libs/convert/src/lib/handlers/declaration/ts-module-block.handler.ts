import * as Babel from '@babel/types';
import { Statement } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaNodeGroup, LuaStatement, nodeGroup } from '@js-to-lua/lua-types';

export const createTSModuleBlockHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
) =>
  createHandler<LuaNodeGroup, Babel.TSModuleBlock>(
    'TSModuleBlock',
    (source, config, node) => {
      const toStatement = handleStatement(source, config);
      return nodeGroup(node.body.map(toStatement));
    }
  );
