type Foo = {
  anotherPropBefore: string,
  (bar: number): number,
  (bar: string): string,
  anotherPropBetween: boolean,
  (bar: boolean): boolean,
  anotherPropAfter: number
}
