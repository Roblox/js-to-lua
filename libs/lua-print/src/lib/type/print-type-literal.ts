import { LuaTypeLiteral } from '@js-to-lua/lua-types';
import { applyTo, last } from 'ramda';
import { GetPrintSections, PrintComments, PrintNode } from '../print-node';
import { getPrintableInnerComments } from '../printable-comments';

export const createPrintTypeLiteral =
  (
    printNode: PrintNode,
    getPrintSections: GetPrintSections,
    printComments: PrintComments
  ) =>
  (node: LuaTypeLiteral): string => {
    const lastItem = last(node.members);
    const lastItemTrailingComments = lastItem && lastItem.trailingComments;

    let trailingSpace;
    if (!lastItem) {
      trailingSpace = '';
    } else if (lastItemTrailingComments?.some((c) => c.type == 'CommentLine')) {
      trailingSpace = '\n';
    } else {
      trailingSpace = ' ';
    }

    const leadingSpace = node.members.length ? ' ' : '';
    const innerComments = applyTo(
      printComments(getPrintableInnerComments(node.innerComments))
    )((comments) => comments.toString() && `\n${comments}\n`);

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
      .join('\n')}${innerComments}${trailingSpace}}`;
  };
