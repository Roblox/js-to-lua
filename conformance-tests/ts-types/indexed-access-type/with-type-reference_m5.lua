-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/indexed-access-type/with-type-reference_m5.ts
type Foo = { bar: string }
type Bar = "bar"
type Test = any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: Foo[Bar] ]]
