-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/intersection/ts-intersection-type-multiple_m5.ts
type SomeType = any
type Multi = { foo: number } & { bar: string } & SomeType
