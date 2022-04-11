import { Program } from '@babel/types';
import { parse, ParserOptions } from '@babel/parser';

export const getProgramNode = (
  code: string,
  additionalParserOptions?: Partial<ParserOptions>
): Program => {
  const file = parse(code, {
    sourceType: 'module',
    strictMode: true,
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'typescript',
    ],
    ...additionalParserOptions,
  });

  return file.program;
};
