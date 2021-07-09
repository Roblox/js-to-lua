import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAliasDeclaration } from '../lua-nodes.types';

export interface ExportTypeStatement extends BaseLuaNode {
  type: 'ExportTypeStatement';
  declaration: LuaTypeAliasDeclaration;
}

export const exportTypeStatement = (
  declaration: ExportTypeStatement['declaration']
): ExportTypeStatement => ({
  type: 'ExportTypeStatement',
  declaration,
});

export const isExportTypeStatement = isNodeType<ExportTypeStatement>(
  'ExportTypeStatement'
);
