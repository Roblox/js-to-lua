const obj0 = {
  foo: 'foo',
  bar: 'bar'
}
const obj1 = {
  ...obj0,
  bar: undefined
}
const obj2 = {
  ...obj0,
  foo: null
}
