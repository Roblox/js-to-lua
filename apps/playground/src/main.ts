import { handleProgram, printNode } from '@js-to-lua/js-to-lua';
import { parse } from '@babel/parser';

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
  ],
});

// Babel AST JSON is printed here
console.log(JSON.stringify(file.program.body, undefined, 2)); // ?

// result Luau code is printed here
console.log(`
code start
----------

${printNode(handleProgram.handler(code, file.program))}

----------
code end
`);
