type Foo = { bar: string, baz: number }
type Test = typeof((({} :: any) :: Foo).bar) | typeof((({} :: any) :: Foo).baz)
