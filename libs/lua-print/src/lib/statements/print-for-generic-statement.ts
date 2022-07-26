import { ForGenericStatement } from '@js-to-lua/lua-types';
import { isTruthy, prependString } from '@js-to-lua/shared-utils';
import { PrintComments, PrintNode } from '../print-node';

export const createPrintForGenericStatement =
  (printNode: PrintNode, printComments: PrintComments) =>
  (node: ForGenericStatement): string => {
    const variables = node.variables.map((n) => printNode(n)).join(', ');
    const iterators = node.iterators.map((n) => printNode(n)).join(', ');
    const body = node.body
      .map((n) => printNode(n))
      .map(prependString('\t'))
      .join('\n');
    const innerComments = printComments(node.innerComments);

    const forBody = [
      `do${innerComments.toString() ? ` ${innerComments}` : ''}`,
      `${body.length > 0 ? `${body}` : ''}`,
      'end',
    ]
      .filter(isTruthy)
      .join('\n');

    return `for ${variables} in ${iterators} ${forBody}`;
  };
