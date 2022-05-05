type AnotherType = {
  prop: string
}
type Test = {
  ...AnotherType,
  foo: string,
  bar: number,
  baz: boolean
};
