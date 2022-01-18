import { AssignmentStatement } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintAssignmentStatement =
  (printNode: PrintNode) =>
  (node: AssignmentStatement): string => {
    const identifiers = node.identifiers.map((id) => printNode(id)).join(', ');
    const initializers = node.values
      .map((value) => printNode(value))
      .join(', ');
    return [identifiers, initializers]
      .filter(Boolean)
      .join(` ${node.operator} `);
  };
