export namespace Foo {
  export type BarType = { bar: string }

  export namespace Bar {
    export type BazType = { baz: number }
    function baz(): BazType {
      return { baz: 1 }
    }
  }
}
