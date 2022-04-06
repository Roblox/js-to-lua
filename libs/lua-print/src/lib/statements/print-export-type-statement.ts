import {
  ExportTypeStatement,
  LuaTypeAliasDeclaration,
} from '@js-to-lua/lua-types';

export const createPrintExportTypeStatement =
  (printDeclaration: (node: LuaTypeAliasDeclaration) => string) =>
  (node: ExportTypeStatement): string => {
    return `export ${printDeclaration(node.declaration)};`;
  };
