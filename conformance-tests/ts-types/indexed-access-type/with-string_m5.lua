type Foo = { bar: string }
type Test = typeof((({} :: any) :: Foo).bar)
