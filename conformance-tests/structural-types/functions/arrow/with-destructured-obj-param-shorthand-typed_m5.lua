-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-destructured-obj-param-shorthand-typed_m5.ts
type Record<K, T> = { [K]: T } --[[ ROBLOX TODO: TS 'Record' built-in type is not available in Luau ]]
local function reduce(ref0: Record<string, any>)
	local foo, bar = ref0.foo, ref0.bar
	return { foo, bar }
end
