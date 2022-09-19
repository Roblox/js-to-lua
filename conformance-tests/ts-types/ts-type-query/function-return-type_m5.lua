-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-type-query/function-return-type_m5.ts
local foo = "foo"
local function fn(): typeof(foo)
	return "foo"
end
