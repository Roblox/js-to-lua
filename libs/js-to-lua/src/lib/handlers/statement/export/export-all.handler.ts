import { ExportAllDeclaration } from '@babel/types';
import { objectAssign } from '@js-to-lua/lua-conversion-utils';
import { callExpression, identifier } from '@js-to-lua/lua-types';
import { createHandler } from '@js-to-lua/handler-utils';
import { createImportExpressionHandler } from '../import/import-expression.handler';

export const createExportAllHandler = () =>
  createHandler(
    'ExportAllDeclaration',
    (source, config, node: ExportAllDeclaration) => {
      const handleImportModuleDeclaration = createImportExpressionHandler()(
        source,
        config
      );
      return callExpression(objectAssign(), [
        identifier('exports'),
        handleImportModuleDeclaration(node.source),
      ]);
    }
  );
