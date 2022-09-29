import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import * as postProcess from './post-process';
export const knownImportsPlugin: JsToLuaPlugin = {
  postProcess,
};

export default knownImportsPlugin;
