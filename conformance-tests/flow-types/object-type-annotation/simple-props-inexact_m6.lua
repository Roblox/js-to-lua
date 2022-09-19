-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/object-type-annotation/simple-props-inexact_m6.js
type Test = { foo: string, bar: number, baz: boolean } --[[ ROBLOX CHECK: inexact type upstream which is not supported by Luau. Verify if it doesn't break the analyze ]]
