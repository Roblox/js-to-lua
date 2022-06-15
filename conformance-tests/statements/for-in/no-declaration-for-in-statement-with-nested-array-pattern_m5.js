let result = ''
for ([ foo, [ bar ] ] in baz) {
  result = result + ', ' + foo
  bar()
}
