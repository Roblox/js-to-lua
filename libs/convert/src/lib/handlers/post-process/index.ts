import { LuaProgram } from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { addExports } from './add-exports';
import { addImports } from './add-imports';
import { addMathConsts } from './add-math-consts';
import { addPolyfills } from './add-polyfills';
import { addQualifiedNameImports } from './add-qualified-name-imports';
import { addUnknownPolyfillType } from './add-unknown-polyfill-type';
import { addVoidPolyfillType } from './add-void-polyfill-type';
import { extractCopyrightComment } from './extract-copyright-comment';
import { gatherExtras } from './gather-extras';
import { removeExtras } from './remove-extras';

export const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(
    gatherExtras,
    extractCopyrightComment,
    addExports,
    addPolyfills,
    addMathConsts,
    addImports,
    addUnknownPolyfillType,
    addVoidPolyfillType,
    addQualifiedNameImports,
    removeExtras
  )(program);
};
