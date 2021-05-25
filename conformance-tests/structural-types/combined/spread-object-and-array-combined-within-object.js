let obj = {
  foo: 'foo',
  bar: 'bar',
  ...{
    fizz: 'fizz',
    buzz: 'buzz'
  },
  fuzz: [
    1, 2,
    ...[3, 4],
    5, 6, {},
    ...[7, 8]
  ]
};
