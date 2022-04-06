for (let i = 0; i < 10; i++) {
  foo(i)
  if (i === 3) {
    i += 2;
    continue
  }
  for (let j = 0; j < 10; j++) {
    if (i === j) {
      j *= 2
      continue
    }
    bar(i, j)
  }
}
