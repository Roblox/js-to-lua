import { Statement } from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { unwrapStatement } from '@js-to-lua/lua-conversion-utils';
import { LuaStatement, nodeGroup } from '@js-to-lua/lua-types';

export const createInnerBodyStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>
) => {
  return createHandlerFunction(
    (source: string, config: EmptyConfig, node: Statement) => {
      const handleStatement_ = handleStatement(source, config);
      return node.type === 'BlockStatement'
        ? nodeGroup(node.body.map(handleStatement_).map(unwrapStatement))
        : nodeGroup(
            [handleStatement(source, config, node)].map(unwrapStatement)
          );
    }
  );
};
