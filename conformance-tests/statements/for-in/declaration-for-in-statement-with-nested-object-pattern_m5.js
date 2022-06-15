let result = ''
for (const { foo, bar: { baz } } in fizz) {
  result = result + ', ' + foo
  baz()
}
