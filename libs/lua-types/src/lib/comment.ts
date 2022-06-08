interface BaseComment {
  value: string;
  type: 'CommentBlock' | 'CommentLine';
  loc: CommentLocation;
}

export type CommentLocation =
  | 'Any'
  | 'SameLineTrailingComment'
  | 'SameLineLeadingComment'
  | 'SameLineInnerComment'
  | 'SameLineLeadingAndTrailingComment';

export interface CommentBlock extends BaseComment {
  type: 'CommentBlock';
}
export interface CommentLine extends BaseComment {
  type: 'CommentLine';
}
export type LuaComment = CommentBlock | CommentLine;

export const commentBlock = (
  value: string,
  loc: CommentLocation = 'Any'
): CommentBlock => ({
  type: 'CommentBlock',
  value,
  loc,
});

export const commentLine = (
  value: string,
  loc: CommentLocation = 'Any'
): CommentLine => ({
  type: 'CommentLine',
  value,
  loc,
});

export const isCommentBlock = (comment: LuaComment): comment is CommentBlock =>
  comment.type === 'CommentBlock';
export const isCommentLine = (comment: LuaComment): comment is CommentLine =>
  comment.type === 'CommentLine';

type SameLineLeadingOrTrailingCommentLocation =
  | 'SameLineTrailingComment'
  | 'SameLineLeadingComment'
  | 'SameLineInnerComment'
  | 'SameLineLeadingAndTrailingComment';

const isCommentWithLoc =
  <L extends CommentLocation>(loc: L) =>
  (comment: LuaComment): comment is LuaComment & { loc: L } =>
    comment.loc === loc;

export const isSameLineComment = (
  comment: LuaComment
): comment is LuaComment & {
  loc: SameLineLeadingOrTrailingCommentLocation;
} =>
  [
    isSameLineLeadingComment,
    isSameLineInnerComment,
    isSameLineTrailingComment,
    isSameLineLeadingAndTrailingComment,
  ].some((predicate) => predicate(comment));

export const isSameLineLeadingComment = isCommentWithLoc(
  'SameLineLeadingComment'
);
export const isSameLineTrailingComment = isCommentWithLoc(
  'SameLineTrailingComment'
);
export const isSameLineInnerComment = isCommentWithLoc('SameLineInnerComment');
export const isSameLineLeadingAndTrailingComment = isCommentWithLoc(
  'SameLineLeadingAndTrailingComment'
);

export const isDefualtLocationComment = isCommentWithLoc('Any');
