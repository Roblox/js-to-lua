let result = ''
for ({ foo, bar: { baz } } in fizz) {
  result = result + ', ' + foo
  baz()
}
