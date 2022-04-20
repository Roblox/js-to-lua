import { NumberLiteralTypeAnnotation } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { LuaTypeNumber, typeNumber } from '@js-to-lua/lua-types';

export const createFlowNumberLiteralTypeAnnotationHandler = () => {
  return createHandler<LuaTypeNumber, NumberLiteralTypeAnnotation>(
    'NumberLiteralTypeAnnotation',
    (source, config, node) =>
      withTrailingConversionComment(
        typeNumber(),
        `ROBLOX NOTE: changed '${getNodeSource(
          source,
          node
        )}' to 'number' as Luau doesn't support numeric singleton types`
      )
  );
};
