import { FlowType, TSType, TypeParameter } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaNode,
  LuaType,
  LuaTypeReference,
  typeReference,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { applyTo, identity } from 'ramda';

export const createFlowTypeParameterHandler = (
  typesHandler: HandlerFunction<LuaType, FlowType | TSType>
) => {
  return createHandler<LuaTypeReference, TypeParameter>(
    'TypeParameter',
    (source, config, typeParameterNode: TypeParameter): LuaTypeReference => {
      const conversionComments = [
        typeParameterNode.variance
          ? 'ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau'
          : '',
        typeParameterNode.bound
          ? 'ROBLOX CHECK: upstream type uses type constraint which is not supported by Luau'
          : '',
      ].filter(isTruthy);

      const addComments: <N extends LuaNode>(node: N) => N =
        conversionComments.length
          ? (node) =>
              withTrailingConversionComment(
                node,
                ...conversionComments,
                getNodeSource(source, typeParameterNode)
              )
          : identity;

      return applyTo(
        typeReference(
          identifier(typeParameterNode.name),
          undefined,
          typeParameterNode.default
            ? typesHandler(source, config, typeParameterNode.default)
            : undefined
        )
      )(addComments);
    }
  );
};
