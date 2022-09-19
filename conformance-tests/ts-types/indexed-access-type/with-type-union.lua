-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/indexed-access-type/with-type-union.ts
type Foo = { bar: string, baz: number }
type Test = typeof((({} :: any) :: Foo).bar) | typeof((({} :: any) :: Foo).baz)
