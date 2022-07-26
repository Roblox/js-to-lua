import { WhileStatement } from '@js-to-lua/lua-types';
import { isTruthy, prependString } from '@js-to-lua/shared-utils';
import { PrintComments, PrintNode } from '../print-node';

export const createPrintWhileStatement =
  (printNode: PrintNode, printComments: PrintComments) =>
  (node: WhileStatement): string => {
    const condition = printNode(node.condition);
    const body = node.body
      .map((n) => printNode(n))
      .map(prependString('\t'))
      .join('\n  ');
    const innerComments = printComments(node.innerComments);

    const whileBody = [
      `do${innerComments.toString() ? ` ${innerComments}` : ''}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'end',
    ]
      .filter(isTruthy)
      .join('\n');

    return `while ${condition} ${whileBody}`;
  };
