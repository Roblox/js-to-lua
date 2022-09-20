import * as Babel from '@babel/types';
import { EmptyConfig } from '@js-to-lua/handler-utils';
import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import { postProcess } from '@js-to-lua/post-process';
import { handleProgram } from './handlers/program/program.handler';

type ConvertProgramOptions = {
  plugins?: Array<JsToLuaPlugin>;
};

export const convertProgram = (
  code: string,
  config: EmptyConfig,
  babelProgram: Babel.Program,
  { plugins }: ConvertProgramOptions = {}
) => {
  const luaProgram = handleProgram.handler(code, config, babelProgram);
  return postProcess(luaProgram, plugins);
};
