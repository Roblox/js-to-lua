let result = ''
for (const [ foo, [ bar ] ] of baz) {
  result = result + ', ' + foo
  bar()
}
