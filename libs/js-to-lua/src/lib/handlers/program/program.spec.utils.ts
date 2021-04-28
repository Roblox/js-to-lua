import { Program } from '@babel/types';
import { parse } from '@babel/parser';

export const getProgramNode = (code: string): Program => {
  const file = parse(code, {
    sourceType: 'module',
    strictMode: true,
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'typescript',
    ],
  });

  return file.program;
};
