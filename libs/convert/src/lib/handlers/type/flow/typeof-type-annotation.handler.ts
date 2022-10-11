import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultTypeHandler,
  reassignComments,
} from '@js-to-lua/lua-conversion-utils';
import { isTypeReference, LuaType, typeQuery } from '@js-to-lua/lua-types';

export const createFlowTypeofTypeAnnotationHandler = (
  handleFlowType: HandlerFunction<LuaType, Babel.FlowType>
) =>
  createHandler<LuaType, Babel.TypeofTypeAnnotation>(
    'TypeofTypeAnnotation',
    (source, config, node) => {
      const argument = handleFlowType(source, config, node.argument);
      return isTypeReference(argument)
        ? typeQuery(reassignComments(argument.typeName, argument))
        : defaultTypeHandler(source, config, node);
    }
  );
