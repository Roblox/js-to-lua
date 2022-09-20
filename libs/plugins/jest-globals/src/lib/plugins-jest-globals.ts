import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import * as postProcess from './post-process';
export const jestPostProcessPlugin: JsToLuaPlugin = {
  postProcess,
};

export default jestPostProcessPlugin;
