import { createHandler } from '../../../types';
import { ExportAllDeclaration } from '@babel/types';
import { createImportExpressionHandler } from '../import/import-expression.handler';
import { callExpression, identifier, objectAssign } from '@js-to-lua/lua-types';

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
