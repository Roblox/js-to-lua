import { parse, ParserOptions } from '@babel/parser';
import { handleProgram } from '@js-to-lua/convert';
import { printNode } from '@js-to-lua/lua-print';

export interface ConversionConfig {
  isInitFile: boolean;
  upstreamPath?: string;
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
    const luaASTProgram = handleProgram.handler(
      code,
      config,
      babelASTFile.program
    );

    return String(printNode(luaASTProgram));
  };
