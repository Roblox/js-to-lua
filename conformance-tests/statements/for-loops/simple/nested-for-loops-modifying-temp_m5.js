for (let i = 0; i < 3; i++) {
  foo(i)
  if (i === 3) {
    i += 1;
  }
  for (let j = 0; j < 5; j++) {
    if (i === j) {
      j *= 2
    }
    bar(i, j)
  }
}
