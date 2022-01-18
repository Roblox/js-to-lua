interface BaseComment {
  value: string;
  type: 'CommentBlock' | 'CommentLine';
  loc: CommentLocation;
}

type CommentLocation =
  | 'Any'
  | 'SameLineTrailingComment'
  | 'SameLineLeadingComment'
  | 'SameLineInnerComment';

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
