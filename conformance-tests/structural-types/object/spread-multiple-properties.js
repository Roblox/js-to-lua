let obj = {
  foo: 'foo',
  bar: 'bar',
  ...{
    baz: 'baz',
    bar: 'another bar'
  },
  fizz: 'fizz',
  buzz: 'buzz',
  ...{
    fuzz: 'fuzz',
    jazz: 'jazz'
  },
}
