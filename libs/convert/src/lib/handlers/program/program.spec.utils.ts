import { parse, ParserOptions } from '@babel/parser';
import { Program } from '@babel/types';
import { prependLeadingComments } from '@js-to-lua/lua-conversion-utils';
import { commentLine, program } from '@js-to-lua/lua-types';

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

export const programWithUpstreamComment: typeof program = (
  ...args: Parameters<typeof program>
) =>
  prependLeadingComments(
    program(...args),
    commentLine(' ROBLOX NOTE: no upstream')
  );
