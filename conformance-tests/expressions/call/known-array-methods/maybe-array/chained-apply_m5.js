const foo = arr
  .filter.apply(arr, filterArgs)
  .map(x => x * 2)
  .reduce((a, b) => a + b)
