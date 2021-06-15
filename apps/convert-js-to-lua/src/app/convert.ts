import { parse } from '@babel/parser';
import { handleProgram, printNode } from '@js-to-lua/js-to-lua';
import { format_code } from 'stylua-wasm';

export const convert = (code: string): string => {
  const babelASTFile = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
  });
  const luaASTProgram = handleProgram.handler(code, babelASTFile.program);

  const luaOutput = printNode(luaASTProgram);
  const formattedLua = format_code(luaOutput);

  return formattedLua;
};
