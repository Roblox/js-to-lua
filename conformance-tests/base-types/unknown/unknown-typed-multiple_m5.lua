-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/unknown/unknown-typed-multiple_m5.ts
type unknown = any --[[ ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported ]]
local foo: unknown = "unknown"
local bar: unknown = "unknown"
local function baz(fizz: unknown): unknown
	return fizz :: unknown
end
