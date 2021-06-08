import { BaseNodeHandler, createHandlerFunction } from '../types';
import { defaultHandler } from './default.handler';

export const combineHandlers = <H extends BaseNodeHandler = BaseNodeHandler>(
  ons: H[],
  fallback = defaultHandler
): H => {
  return {
    type: ons.map(({ type }) => type).flat(),
    handler: createHandlerFunction((source, node) => {
      const { handler } = ons.find((on) => {
        const types = Array.isArray(on.type) ? on.type : [on.type];
        return types.includes(node.type);
      }) || { handler: fallback };

      return handler(source, node);
    }),
  } as H;
};
