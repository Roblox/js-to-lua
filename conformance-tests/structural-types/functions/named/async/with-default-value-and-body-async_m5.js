async function foo(bar = defaultBar) {
  let foo = 'foo'
  await bar;
  return foo
}
