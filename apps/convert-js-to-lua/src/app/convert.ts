import { parse, ParserOptions } from '@babel/parser';
import { handleProgram, printNode } from '@js-to-lua/js-to-lua';

const DEFAULT_BABEL_OPTIONS: ParserOptions = {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'typescript', 'classProperties'],
};

export const convert = (babelOptions_: ParserOptions | undefined) => (
  code: string
): string => {
  const babelOptions = {
    ...DEFAULT_BABEL_OPTIONS,
    ...babelOptions_,
  };
  const babelASTFile = parse(code, babelOptions);
  const luaASTProgram = handleProgram.handler(code, babelASTFile.program);

  return printNode(luaASTProgram);
};
