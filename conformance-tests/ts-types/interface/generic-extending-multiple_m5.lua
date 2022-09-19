-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/interface/generic-extending-multiple_m5.ts
type Foo<T> = Bar<T> & Fizz & { baz: T }
