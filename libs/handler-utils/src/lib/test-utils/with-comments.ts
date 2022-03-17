import { CommentLine, Node as BabelNode } from '@babel/types';
import { commentLine, LuaNode } from '@js-to-lua/lua-types';

export function withComments<T extends BabelNode, U extends LuaNode>(
  given: T,
  expected: U
) {
  return {
    given: {
      ...given,
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    } as T,
    expected: {
      ...expected,
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    } as U,
  };
}

export function withBabelComments<T extends BabelNode>(node: T) {
  return {
    ...node,
    leadingComments: [{ value: 'Leading', type: 'CommentLine' } as CommentLine],
    innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
    trailingComments: [
      { value: 'Trailing', type: 'CommentLine' } as CommentLine,
    ],
  } as T;
}

export function withLuaComments<T extends LuaNode>(node: T) {
  return {
    ...node,
    leadingComments: [commentLine('Leading')],
    innerComments: [commentLine('Inner')],
    trailingComments: [commentLine('Trailing')],
  } as T;
}
