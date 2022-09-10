const pickPairsWithSameOrder = <T>(array: ReadonlyArray<T>) =>
  array
    .map((value1, idx, arr) =>
      arr.slice(idx + 1).map(value2 => [value1, value2]),
    )
    // use .flat() when we drop Node 10
    .reduce((acc, val) => acc.concat(val), []);
