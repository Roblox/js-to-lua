for (let i = 0; i < 3; i++) {
  foo(i)
  for (let j = 0; j < 5; j++) {
    bar(i, j)
  }
}
