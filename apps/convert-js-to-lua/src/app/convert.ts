import { parse } from '@babel/parser';
import { handleProgram, printNode } from '@js-to-lua/js-to-lua';

export const convert = (code: string): string => {
  const babelASTFile = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'classProperties'],
  });
  const luaASTProgram = handleProgram.handler(code, babelASTFile.program);

  return printNode(luaASTProgram);
};
