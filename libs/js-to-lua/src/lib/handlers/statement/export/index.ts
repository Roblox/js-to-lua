import { combineStatementHandlers } from '../../../utils/combine-handlers';
import { createExportNamedHandler } from './export-named.handler';
import { createHandler, HandlerFunction } from '../../../types';
import {
  LuaDeclaration,
  LuaExpression,
  LuaStatement,
  withExtras,
} from '@js-to-lua/lua-types';
import { Declaration, Expression } from '@babel/types';
import { createExportDefaultHandler } from './export-default.handler';

export const createExportHandler = (
  handleDeclaration: HandlerFunction<LuaDeclaration, Declaration>,
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const { type, handler } = combineStatementHandlers<LuaStatement, Declaration>(
    [
      createExportNamedHandler(handleDeclaration),
      createExportDefaultHandler(handleDeclaration, handleExpression),
    ]
  );
  const withExportsExtras = withExtras({ doesExport: true });
  return createHandler(type, (source: string, config, node: Declaration) =>
    withExportsExtras(handler(source, config, node))
  );
};
