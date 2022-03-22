import {
  isElseifExpressionClause,
  isIfExpressionClause,
  LuaExpressionClause,
  LuaIfExpression,
} from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintIfExpression = (printNode: PrintNode) => {
  return (node: LuaIfExpression): string => {
    const clauses = [
      node.ifClause,
      ...(node.elseifClauses ? node.elseifClauses : []),
      node.elseClause,
    ];
    return `${clauses.map(printExpressionClause).join('\n')}`;
  };

  function printExpressionClause(node: LuaExpressionClause): string {
    const body = printNode(node.body);
    if (isIfExpressionClause(node) || isElseifExpressionClause(node)) {
      return `${isIfExpressionClause(node) ? 'if' : 'elseif'} ${printNode(
        node.condition
      )}\nthen ${body}`;
    } else {
      return `else ${body}`;
    }
  }
};
