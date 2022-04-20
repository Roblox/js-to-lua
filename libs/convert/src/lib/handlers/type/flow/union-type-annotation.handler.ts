import { FlowType, UnionTypeAnnotation } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { reassignComments } from '@js-to-lua/lua-conversion-utils';
import {
  isTypeNumber,
  LuaType,
  LuaTypeUnion,
  typeUnion,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { groupBy } from 'ramda';

export const createUnionTypeAnnotationHandler = (
  handleFlowType: HandlerFunction<LuaType, FlowType>
) => {
  return createHandler<LuaTypeUnion, UnionTypeAnnotation>(
    'UnionTypeAnnotation',
    (source, config, node) => {
      const typesGroups = groupBy(
        (a) => (isTypeNumber(a) ? a.type : JSON.stringify(a)),
        node.types.map((x) => handleFlowType(source, config, x))
      );
      const types = Object.keys(typesGroups)
        .map((groupKey) => typesGroups[groupKey])
        .filter(isTruthy)
        .map((group) => reassignComments(group[0], ...group.slice(1)));
      return typeUnion(types);
    }
  );
};
