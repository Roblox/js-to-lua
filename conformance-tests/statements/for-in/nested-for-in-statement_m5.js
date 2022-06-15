let result = ''
for (const foo in fizz) {
  for(const bar in buzz) {
    result = result + ', ' + foo + ':' + bar
  }
}
