import { Comment, SourceLocation } from '@babel/types';
import { LuaComment, LuaNode } from '@js-to-lua/lua-types';
import { BabelNode } from './types';

const handledComments = new Map() as Map<Comment, LuaComment>;

export const handleComments = <R extends LuaNode>(
  source: string,
  { leadingComments, innerComments, trailingComments, loc }: BabelNode,
  luaNode: R
): R => {
  const toLuaComment = (comment: Comment) =>
    handleComment(source, comment, loc);
  return {
    ...luaNode,
    ...(leadingComments
      ? {
          leadingComments: [
            ...(luaNode.leadingComments || []),
            ...leadingComments.map(toLuaComment),
          ],
        }
      : {}),
    ...(innerComments
      ? {
          innerComments: [
            ...(luaNode.innerComments || []),
            ...innerComments.map(toLuaComment),
          ],
        }
      : {}),
    ...(trailingComments
      ? {
          trailingComments: [
            ...(luaNode.trailingComments || []),
            ...trailingComments.map(toLuaComment),
          ],
        }
      : {}),
  };
};

const handleComment = (
  _source: string,
  comment: Comment,
  loc: SourceLocation | null
): LuaComment => {
  if (!handledComments.has(comment)) {
    handledComments.set(comment, {
      type: comment.type,
      value: comment.value,
      loc: 'Any',
    });
  }
  const handled = handledComments.get(comment)!;

  if (!loc) {
    return handled;
  }

  if (
    loc.start.line == comment.loc.end.line &&
    loc.start.column > comment.loc.end.column
  ) {
    handled.loc = 'SameLineLeadingComment';
  }
  if (
    loc.end.line == comment.loc.start.line &&
    loc.end.column < comment.loc.start.column
  ) {
    handled.loc = 'SameLineTrailingComment';
  }

  return handled;
};
