import { Node as BabelNode } from '@babel/types';

export const withLocation =
  ({ start, end }: { start: number; end: number }) =>
  <N extends BabelNode>(node: N): N => ({
    ...node,
    start,
    end,
  });

export const withLocationFromSource = (source: string) => (snippet: string) => {
  const start = source.indexOf(snippet);
  const end = start + snippet.length;
  return withLocation({ start, end });
};
