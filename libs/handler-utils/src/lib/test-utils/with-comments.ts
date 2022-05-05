import { CommentLine, Node as BabelNode } from '@babel/types';
import { commentLine, LuaNode } from '@js-to-lua/lua-types';
import { appendComments } from '../append-comments';

const addPrefix = (prefix: string) => (value: string) =>
  prefix ? `[${prefix}] ${value}` : value;

export const withComments = <T extends BabelNode, U extends LuaNode>(
  given: T,
  expected: U,
  prefix = ''
) => ({
  given: withBabelComments(given, prefix),
  expected: withLuaComments(expected, prefix),
});

export function withBabelComments<T extends BabelNode>(node: T, prefix = '') {
  const addPrefixTo = addPrefix(prefix);
  return {
    ...node,
    leadingComments: [
      { value: addPrefixTo('Leading'), type: 'CommentLine' } as CommentLine,
    ],
    innerComments: [
      { value: addPrefixTo('Inner'), type: 'CommentLine' } as CommentLine,
    ],
    trailingComments: [
      { value: addPrefixTo('Trailing'), type: 'CommentLine' } as CommentLine,
    ],
  } as T;
}

export function withLuaComments<T extends LuaNode>(node: T, prefix = '') {
  const addPrefixTo = addPrefix(prefix);
  return {
    ...node,
    leadingComments: appendComments(node.leadingComments, [
      commentLine(addPrefixTo('Leading')),
    ]),
    innerComments: appendComments(node.innerComments, [
      commentLine(addPrefixTo('Inner')),
    ]),
    trailingComments: appendComments(node.trailingComments, [
      commentLine(addPrefixTo('Trailing')),
    ]),
  } as T;
}

export function withLuaInnerComments<T extends LuaNode>(node: T, prefix = '') {
  const addPrefixTo = addPrefix(prefix);
  return {
    ...node,
    innerComments: appendComments(node.innerComments, [
      commentLine(addPrefixTo('Leading')),
      commentLine(addPrefixTo('Inner')),
      commentLine(addPrefixTo('Trailing')),
    ]),
  } as T;
}
