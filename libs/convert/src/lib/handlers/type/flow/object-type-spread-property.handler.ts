import { FlowType, ObjectTypeSpreadProperty } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaType } from '@js-to-lua/lua-types';

export const createObjectTypeSpreadPropertyHandler = (
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  return createHandlerFunction<LuaType, ObjectTypeSpreadProperty>(
    (source, config, node) => {
      return handleFlowType(source, config, node.argument);
    }
  );
};
