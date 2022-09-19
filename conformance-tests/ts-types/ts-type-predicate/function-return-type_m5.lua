-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-type-predicate/function-return-type_m5.ts
local foo = "foo"
local function fn(
	bar
): boolean --[[ ROBLOX FIXME: change to TSTypePredicate equivalent if supported ]] --[[ bar is string ]]
	return true
end
