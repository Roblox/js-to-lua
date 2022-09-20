import { parse, ParserOptions } from '@babel/parser';
import { convertProgram } from '@js-to-lua/convert';
import { printNode } from '@js-to-lua/lua-print';
import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';

export interface ConversionConfig {
  isInitFile: boolean;
  upstreamPath?: string;
  plugins?: Array<JsToLuaPlugin>;
}

const DEFAULT_BABEL_OPTIONS: ParserOptions = {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'typescript', 'classProperties'],
};

export const convert =
  (babelOptions_: ParserOptions | undefined) =>
  (config: ConversionConfig, code: string): string => {
    const babelOptions = {
      ...DEFAULT_BABEL_OPTIONS,
      ...babelOptions_,
    };
    const babelASTFile = parse(code, babelOptions);
    const luaASTProgram = convertProgram(code, config, babelASTFile.program, {
      plugins: config.plugins,
    });

    return String(printNode(luaASTProgram));
  };
