type Foo = { bar: string, baz: number }
type Test = Foo[keyof Foo]