let result = ''
for ([ foo, [ bar ] ] of baz) {
  result = result + ', ' + foo
  bar()
}
