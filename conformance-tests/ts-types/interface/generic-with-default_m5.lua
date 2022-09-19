-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/interface/generic-with-default_m5.ts
type Foo<T = string, U = number> = { baz: T, fuzz: U }
