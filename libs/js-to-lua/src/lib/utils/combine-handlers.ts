import { BaseNodeHandler } from '../types';
import { defaultHandler } from './default.handler';

export const combineHandlers = <H extends BaseNodeHandler = BaseNodeHandler>(
  ons: H[]
): H => {
  return {
    type: ons.map(({ type }) => type).flat(),
    handler: (node) => {
      const { handler } = ons.find((on) => {
        const types = Array.isArray(on.type) ? on.type : [on.type];
        return types.includes(node.type);
      }) || { handler: defaultHandler };

      return handler(node);
    },
  } as H;
};
