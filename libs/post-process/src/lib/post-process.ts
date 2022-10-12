import { LuaProgram } from '@js-to-lua/lua-types';
import { getPluginsStages, JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import { pipe } from 'ramda';
import { addExports } from './steps/add-exports';
import { addImports } from './steps/add-imports';
import { addMathConsts } from './steps/add-math-consts';
import { addNumberConsts } from './steps/add-number-consts';
import { addPolyfills } from './steps/add-polyfills';
import { addPromiseImport } from './steps/add-promise-import';
import { addQualifiedNameImports } from './steps/add-qualified-name-imports';
import { addVoidPolyfillType } from './steps/add-void-polyfill-type';
import { extractCopyrightComment } from './steps/extract-copyright-comment';
import { gatherExtras } from './steps/gather-extras';
import { removeExtras } from './steps/remove-extras';

const runStage = pipe(
  addExports,
  addPromiseImport,
  addPolyfills,
  addMathConsts,
  addNumberConsts,
  addImports,
  addVoidPolyfillType,
  addQualifiedNameImports
);

const gatherStage = pipe(extractCopyrightComment, gatherExtras);

export const postProcess = (
  program: LuaProgram,
  plugins: Array<JsToLuaPlugin> = []
): LuaProgram => {
  const { preGather, postGather, preRun, postRun, preCleanup } =
    getPluginsStages(plugins);

  return pipe(
    preGather,
    /**
     * gather stage
     */
    gatherStage,
    postGather,
    preRun,
    /**
     * run stage
     */
    runStage,
    postRun,
    /**
     * cleanup stage
     */
    preCleanup,
    removeExtras
  )(program);
};
