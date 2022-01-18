const foo = arr
  .filter(x => x !== 7)
  .map(x => x * 2)
  .reduce((a, b) => a + b)
