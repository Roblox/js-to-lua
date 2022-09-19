-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-destructured-arr-param-shorthand_m4.js
local function reduce(ref0)
	local foo, bar = table.unpack(ref0, 1, 2)
	return { foo = foo, bar = bar }
end
