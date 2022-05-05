type Foo = {
  foo: string
}
type Bar = {
  bar: string
}
type Test = {
  prop: string,
  ...Foo,
  ...Bar,
  [string]: boolean,
  (): any,
  (string): string,
  [[Slot]]: any,
}
