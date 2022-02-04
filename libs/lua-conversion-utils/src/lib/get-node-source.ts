import { BabelNode } from '@js-to-lua/handler-utils';

export const getNodeSource = (source: string, node: BabelNode): string =>
  source.slice(node.start || 0, node.end || 0);
