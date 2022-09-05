import {
  isCommentBlock,
  isCommentLine,
  isSameLineComment,
  isSameLineInnerComment,
  isSameLineLeadingAndTrailingComment,
  isSameLineLeadingComment,
  isSameLineTrailingComment,
  LuaComment,
} from '@js-to-lua/lua-types';
import { printableNode, PrintableNode } from '@js-to-lua/shared-utils';
import { last } from 'ramda';
import { calculateEqualsForDelimiter } from './utils';

const printedNodes = new Map();

// Must remove added comment to jsx elements when parsed
const isBabelAddedComment = (comment: LuaComment) =>
  comment.value === '#__PURE__';

export const _printComments = (
  comments: ReadonlyArray<LuaComment> | undefined
): PrintableNode => {
  const getCommentLeadingSpace = (
    comment: LuaComment,
    index: number,
    prev: LuaComment | null
  ) => {
    return isSameLineComment(comment) && comment.loc == prev?.loc
      ? ' '
      : index !== 0
      ? '\n'
      : '';
  };

  const commentsStr = comments
    ? comments
        .map((comment, i) => {
          printedNodes.set(comment, true);
          const prev = i !== 0 ? comments[i - 1] : null;
          const leadingSpace = getCommentLeadingSpace(comment, i, prev);
          if (isCommentBlock(comment)) {
            const numberOfEquals = calculateEqualsForDelimiter(comment.value);
            return `${leadingSpace}--[${'='.repeat(numberOfEquals)}[${
              comment.value
            }]${'='.repeat(numberOfEquals)}]`;
          } else {
            return `${leadingSpace}--${comment.value}`;
          }
        })
        .join('')
    : '';

  const lastComment = last(comments || []);
  return printableNode(
    commentsStr,
    !!lastComment && isCommentLine(lastComment)
  );
};

export const getFilteredLeadingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![isSameLineTrailingComment, isSameLineInnerComment].some((predicate) =>
        predicate(n)
      )
  );

export const getPrintableLeadingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] => getFilteredLeadingComments(comments).filter(notPrinted);

export const getFilteredInnerComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![
        isSameLineLeadingComment,
        isSameLineTrailingComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(n))
  );

export const getPrintableInnerComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] => getFilteredInnerComments(comments).filter(notPrinted);

export const getFilteredTrailingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] =>
  comments.filter(
    (n) =>
      !isBabelAddedComment(n) &&
      ![
        isSameLineLeadingComment,
        isSameLineInnerComment,
        isSameLineLeadingAndTrailingComment,
      ].some((predicate) => predicate(n))
  );

export const getPrintableTrailingComments = (
  comments: readonly LuaComment[] | undefined = []
): LuaComment[] => getFilteredTrailingComments(comments).filter(notPrinted);

const notPrinted = (n: LuaComment) => !printedNodes.get(n);
