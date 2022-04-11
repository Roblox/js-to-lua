import { TSType, TypeParameterDeclaration } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  LuaType,
  LuaTypeParameterDeclaration,
  typeParameterDeclaration,
} from '@js-to-lua/lua-types';
import { createFlowTypeParameterHandler } from './type-parameter.handler';

export const createFlowTypeParameterDeclarationHandler = (
  typesHandler: HandlerFunction<LuaType, TSType>
) => {
  return createHandler<LuaTypeParameterDeclaration, TypeParameterDeclaration>(
    'TypeParameterDeclaration',
    (source, config, node) => {
      const handleFlowTypeParameter = createFlowTypeParameterHandler(
        typesHandler
      ).handler(source, config);
      return typeParameterDeclaration(node.params.map(handleFlowTypeParameter));
    }
  );
};
