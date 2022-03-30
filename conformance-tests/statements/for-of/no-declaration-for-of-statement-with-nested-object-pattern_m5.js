let result = ''
for ({ foo, bar: { baz } } of fizz) {
  result = result + ', ' + foo
  baz()
}
