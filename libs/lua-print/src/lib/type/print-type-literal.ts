import { LuaTypeLiteral } from '@js-to-lua/lua-types';
import { last } from 'ramda';
import { GetPrintSections, PrintNode } from '../print-node';

export const createPrintTypeLiteral =
  (printNode: PrintNode, getPrintSections: GetPrintSections) =>
  (node: LuaTypeLiteral): string => {
    const lastItem = last(node.members);
    const lastItemTrailingComments = lastItem && lastItem.trailingComments;

    let trailingSpace;
    if (!lastItem) {
      trailingSpace = '';
    } else if (!lastItemTrailingComments) {
      trailingSpace = ' ';
    } else if (lastItemTrailingComments?.some((c) => c.type == 'CommentLine')) {
      trailingSpace = '\n';
    } else {
      trailingSpace = '';
    }

    const leadingSpace =
      node.members.length && !node.members[0].leadingComments?.length
        ? ' '
        : '';

    return `{${leadingSpace}${node.members
      .map((member) =>
        printNode(member, (typeElement) => {
          const {
            leadingComments,
            leadSeparator,
            nodeStr,
            trailingComments,
            trailingSeparator,
          } = getPrintSections(typeElement);
          return `${leadingComments}${leadSeparator}${nodeStr},${trailingSeparator}${trailingComments}`;
        })
      )
      .join('\n')}${trailingSpace}}`;
  };
