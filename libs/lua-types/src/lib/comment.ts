interface BaseComment {
  value: string;
  type: 'CommentBlock' | 'CommentLine';
}

export interface CommentBlock extends BaseComment {
  type: 'CommentBlock';
}
export interface CommentLine extends BaseComment {
  type: 'CommentLine';
}
export type LuaComment = CommentBlock | CommentLine;

export const commentBlock = (value: string): CommentBlock => ({
  type: 'CommentBlock',
  value,
});

export const commentLine = (value: string): CommentLine => ({
  type: 'CommentLine',
  value,
});

export const isCommentBlock = (comment: LuaComment): comment is CommentBlock =>
  comment.type === 'CommentBlock';
export const isCommentLine = (comment: LuaComment): comment is CommentLine =>
  comment.type === 'CommentLine';
