-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/indexed-access-type/with-keyof.ts
type Foo = { bar: string, baz: number }
type Test = any --[[ ROBLOX FIXME: Unhandled type. ]] --[[ Upstream: Foo[keyof Foo] ]]
