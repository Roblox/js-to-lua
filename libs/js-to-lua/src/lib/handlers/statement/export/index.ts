import { Declaration, Expression, Identifier } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  combineStatementHandlers,
  withExtras,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { createExportAllHandler } from './export-all.handler';
import { createExportDefaultHandler } from './export-default.handler';
import { createExportNamedHandler } from './export-named.handler';

export const createExportHandler = (
  handleDeclaration: HandlerFunction<LuaDeclaration, Declaration>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  const { type, handler } = combineStatementHandlers<LuaStatement, Declaration>(
    [
      createExportNamedHandler(
        handleDeclaration,
        handleExpression,
        handleIdentifier
      ),
      createExportDefaultHandler(handleDeclaration, handleExpression),
      createExportAllHandler(),
    ]
  );
  const withExportsExtras = withExtras({ doesExport: true });
  return createHandler(type, (source: string, config, node: Declaration) =>
    withExportsExtras(handler(source, config, node))
  );
};
