import { MixedTypeAnnotation } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { identifier, LuaType, typeReference } from '@js-to-lua/lua-types';

export const createFlowMixedTypeAnnotationHandler = () =>
  createHandler<LuaType, MixedTypeAnnotation>('MixedTypeAnnotation', () =>
    typeReference(identifier('unknown'))
  );
