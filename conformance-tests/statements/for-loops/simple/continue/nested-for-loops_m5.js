for (let i = 0; i < 3; i++) {
  if(i === 1) {
    continue
  }
  foo(i)
  for (let j = 0; j < 5; j++) {
    if(j === 2) {
      continue
    }
    bar(i, j)
  }
}
