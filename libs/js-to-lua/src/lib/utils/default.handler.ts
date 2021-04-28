import { BaseNodeHandler } from '../types';

export const defaultHandler: BaseNodeHandler['handler'] = (node) => {
  return {
    type: 'UnhandledNode',
    start: node.start,
    end: node.end,
  };
};
