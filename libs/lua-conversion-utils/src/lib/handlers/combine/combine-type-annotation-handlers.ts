import {
  BabelNode,
  BaseNodeHandler,
  combineHandlers,
  ConfigBase,
  EmptyConfig,
} from '@js-to-lua/handler-utils';
import { LuaTypeAnnotation } from '@js-to-lua/lua-types';
import { defaultTypeAnnotationHandler } from '../default';

export const combineTypeAnnotationHandlers = <
  R extends LuaTypeAnnotation = LuaTypeAnnotation,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultTypeAnnotationHandler);
