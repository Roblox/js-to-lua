import { ExportTypeStatement } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintExportTypeStatement =
  (printDeclaration: PrintNode) =>
  (node: ExportTypeStatement): string => {
    return `export ${printDeclaration(node.declaration)};`;
  };
