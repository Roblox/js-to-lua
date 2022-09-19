-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/indexed-access-type/with-string_m5.ts
type Foo = { bar: string }
type Test = typeof((({} :: any) :: Foo).bar)
