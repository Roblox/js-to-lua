import { Statement } from '@babel/types';
import { LuaStatement, nodeGroup } from '@js-to-lua/lua-types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';

export const createInnerBodyStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
) => {
  return createHandlerFunction(
    (source: string, config: EmptyConfig, node: Statement) => {
      const handleStatement_ = handleStatement(source, config);
      return node.type === 'BlockStatement'
        ? nodeGroup(node.body.map(handleStatement_))
        : nodeGroup([handleStatement(source, config, node)]);
    }
  );
};
