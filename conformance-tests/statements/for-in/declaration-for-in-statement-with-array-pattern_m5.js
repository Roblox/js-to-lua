let result = ''
for (const [ foo, bar ] in baz) {
  result = result + ', ' + foo
  bar()
}
