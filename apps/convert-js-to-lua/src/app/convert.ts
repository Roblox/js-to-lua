import { parse } from '@babel/parser';
import { handleProgram, printNode } from '@js-to-lua/js-to-lua';

export const convert = (code) => {
  const babelASTFile = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
  });
  const luaASTProgram = handleProgram.handler(code, babelASTFile.program);
  return printNode(luaASTProgram);
};
