const a = 10;
const b = 8;

function foo() {
  return b;
}

function bar() {
  return foo;
}

export { a, b, foo as c, bar as d };
