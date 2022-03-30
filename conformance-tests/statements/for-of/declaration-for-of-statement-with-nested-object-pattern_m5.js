let result = ''
for (const { foo, bar: { baz } } of fizz) {
  result = result + ', ' + foo
  baz()
}
