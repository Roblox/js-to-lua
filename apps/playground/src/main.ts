import { handleProgram, printNode } from '@js-to-lua/js-to-lua';

console.log('Hello World!');

import { parse } from '@babel/parser';
// import { printNode } from "./print-node";

const code = `

var myfu

[1,2,3, 'string']
1
2
3
'string'
1 + 1
undefined
null
let a
let b = 10
let c, d = 'd'
var e
var f = 15
var g = 'g'
var Symbol = function() {}
const aConstant = 13
const greeting = 'Hey', name = 'Jude'
"a string with a \\"quote\\" in it"
"😀"
"👩‍⚕️"
Symbol
Symbol(1)
Symbol("one")
Symbol(true)
Symbol(false)
test(2)
"test"(call(3))
function foo(){}
function fooWithParams(bar, baz){}
function fooWithParamsAndDefaultValues(bar, baz = 12){}
function fee(){
  let anything
  function fee(){
    let myvar = 30
  }
}
let typedA: any = 'ts type any'
let typedB: number = 123

`;

`
    // function test() {
    //     console.log('test');
    //     // comment
    //     return 1;
    // }
    // function test1() {
    //     console.log('test');
    //     // comment
    // }
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

//   file.comments // ?
//   file.toString() // ?

//   file.program.body // ?

console.log(JSON.stringify(file.program.body, undefined, 2)); // ?
//

console.log(`
code start
----------

${printNode(handleProgram.handler(file.program), code)}

----------
code end
`);

// printNode(file.program, code);
//
// console.log(code.slice(file.program.body.start, file.program.body.end))
