import * as Babel from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import { LuaType, typeNil } from '@js-to-lua/lua-types';

export const createNullLiteralTypeAnnotationHandler = () =>
  createHandler<LuaType, Babel.NullLiteralTypeAnnotation>(
    'NullLiteralTypeAnnotation',
    () =>
      withTrailingConversionComment(
        typeNil(),
        "ROBLOX CHECK: verify if `null` wasn't used differently than `undefined`"
      )
  );
