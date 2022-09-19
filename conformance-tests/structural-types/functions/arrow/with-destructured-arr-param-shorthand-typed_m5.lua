-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-destructured-arr-param-shorthand-typed_m5.ts
local function reduce(ref0: Array<number>)
	local foo, bar = table.unpack(ref0, 1, 2)
	return { foo = foo, bar = bar }
end
