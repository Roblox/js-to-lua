import { commentLine, LuaNode } from '@js-to-lua/lua-types';
import { prependLeadingComments } from './leading-comment';

export const addSectionHeader = <N extends LuaNode>(
  nodes: Array<N>,
  sectionName: string
): Array<N> => {
  if (!nodes.length) {
    return nodes;
  }
  const [first, ...rest] = nodes;

  return [
    prependLeadingComments(
      first,
      commentLine(''),
      commentLine(` *** ${sectionName} *** `),
      commentLine('')
    ),
    ...rest,
  ];
};
