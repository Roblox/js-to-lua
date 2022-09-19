-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/object-type-annotation/spread-with-props_m6.js
type AnotherType = { prop: string }
type Test = AnotherType & { foo: string, bar: number, baz: boolean }
