import { convertProgram } from '@js-to-lua/convert';
import { parse } from '@babel/parser';
import { printNode } from '@js-to-lua/lua-print';
import { jestPostProcessPlugin } from '@js-to-lua/plugins/jest-globals';
import { safeApply } from '@js-to-lua/shared-utils';
import { format_code } from 'stylua-wasm';

export const run = () => {
  // THIS IS A PLAYGROUND FILE
  // PLEASE DO NOT COMMIT CHANGES TO THIS FILE

  const code = `
// put code that you want to test here
`;

  const file = parse(code, {
    // parse in strict mode and allow module declarations
    sourceType: 'module',
    plugins: [
      // enable jsx and flow syntax
      'jsx',
      'typescript',
      'classProperties',
    ],
  });

  // Babel AST JSON is printed here
  console.log(JSON.stringify(file.program.body, undefined, 2)); // ?

  // result Luau code is printed here
  console.log(`
code start
----------

${safeApply(format_code)(
  printNode(
    convertProgram(code, {}, file.program, {
      plugins: [jestPostProcessPlugin],
    })
  ).toString()
)}

----------
code end
`);
};
