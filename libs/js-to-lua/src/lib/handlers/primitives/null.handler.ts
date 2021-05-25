import { BaseNodeHandler } from '../../types';
import { NullLiteral } from '@babel/types';
import { LuaNilLiteral } from '@js-to-lua/lua-types';

export const handleNullLiteral: BaseNodeHandler<NullLiteral, LuaNilLiteral> = {
  type: 'NullLiteral',
  handler: () => {
    return {
      type: 'NilLiteral',
    };
  },
};
