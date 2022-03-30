import { Node as BabelNode } from '@babel/types';

export const withLocation =
  ({ start, end }: { start: number; end: number }) =>
  <N extends BabelNode>(node: N): N => ({
    ...node,
    start,
    end,
  });
