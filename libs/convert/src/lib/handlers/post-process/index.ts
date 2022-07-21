import { LuaProgram } from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { addExports } from './add-exports';
import { addImports } from './add-imports';
import { addPolyfills } from './add-polyfills';
import { addQualifiedNameImports } from './add-qualified-name-imports';
import { addUnknownPolyfillType } from './add-unknown-polyfill-type';
import { addVoidPolyfillType } from './add-void-polyfill-type';
import { gatherExtras } from './gather-extras';
import { removeExtras } from './remove-extras';

export const postProcess = (program: LuaProgram): LuaProgram => {
  return pipe(
    gatherExtras,
    addExports,
    addPolyfills,
    addImports,
    addUnknownPolyfillType,
    addVoidPolyfillType,
    addQualifiedNameImports,
    removeExtras
  )(program);
};
