import {
  isElseifClause,
  isIfClause,
  LuaClause,
  LuaIfStatement,
} from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintIfStatement = (printNode: PrintNode) => {
  return function printIfStatement(node: LuaIfStatement): string {
    const clauses = [
      node.ifClause,
      ...(node.elseifClauses ? node.elseifClauses : []),
      ...(node.elseClause ? [node.elseClause] : []),
    ];
    return `${clauses.map(printClause).join('\n')}
end`;
  };

  function printClause(node: LuaClause): string {
    const body = printNode(node.body);
    if (isIfClause(node) || isElseifClause(node)) {
      return `${isIfClause(node) ? 'if' : 'elseif'} ${printNode(
        node.condition
      )} then${body ? `\n${body}` : ''}`;
    } else {
      return `else${body ? `\n${body}` : ''}`;
    }
  }
};
