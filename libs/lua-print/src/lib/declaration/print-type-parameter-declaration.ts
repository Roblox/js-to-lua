import { LuaTypeParameterDeclaration } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeParameterDeclaration =
  (printNode: PrintNode) => (node: LuaTypeParameterDeclaration) => {
    return `<${node.params.map((param) => printNode(param)).join(',')}>`;
  };
