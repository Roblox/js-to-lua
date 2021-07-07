import { combineStatementHandlers } from '../../../utils/combine-handlers';
import { createExportNamedHandler } from './export-named.handler';
import { createHandler, HandlerFunction } from '../../../types';
import {
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
  withExtras,
} from '@js-to-lua/lua-types';
import { Declaration, Expression, Identifier } from '@babel/types';
import { createExportDefaultHandler } from './export-default.handler';
import { createExportAllHandler } from './export-all.handler';

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
