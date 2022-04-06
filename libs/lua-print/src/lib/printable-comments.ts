import {
  isCommentBlock,
  isSameLineComment,
  isSameLineInnerComment,
  isSameLineLeadingAndTrailingComment,
  isSameLineLeadingComment,
  isSameLineTrailingComment,
  LuaComment,
} from '@js-to-lua/lua-types';
import { calculateEqualsForDelimiter } from './utils';

const printedNodes = new Map();

// Must remove added comment to jsx elements when parsed
const isBabelAddedComment = (comment: LuaComment) =>
  comment.value === '#__PURE__';

export const _printComments = (
  comments: ReadonlyArray<LuaComment> | undefined
): string => {
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

  return comments
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
): LuaComment[] =>
  getFilteredLeadingComments(comments).filter((n) => !printedNodes.get(n));

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
): LuaComment[] =>
  getFilteredInnerComments(comments).filter((n) => !printedNodes.get(n));

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
): LuaComment[] =>
  getFilteredTrailingComments(comments).filter((n) => !printedNodes.get(n));
