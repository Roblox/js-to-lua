-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/unknown/unknown-typed-multiple_m5.ts
local foo: unknown = "unknown"
local bar: unknown = "unknown"
local function baz(fizz: unknown): unknown
	return fizz :: unknown
end
