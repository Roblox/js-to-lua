import { parse, ParserOptions } from '@babel/parser';
import { ConfigBase, handleProgram, printNode } from '@js-to-lua/js-to-lua';

export interface ConversionConfig extends ConfigBase {
  isInitFile: boolean;
}

const DEFAULT_BABEL_OPTIONS: ParserOptions = {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'typescript', 'classProperties'],
};

export const convert = (babelOptions_: ParserOptions | undefined) => (
  config: ConversionConfig,
  code: string
): string => {
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

  return printNode(luaASTProgram);
};
