-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/named/with-destructured-obj-param_m4.js
local function reduce(ref0)
	local foo, bar = ref0.foo, ref0.bar
	return { foo, bar }
end
