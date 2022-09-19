-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/named/with-destructured-obj-param-typed_m5.ts
local function reduce(ref0: Record<string, any>)
	local foo, bar = ref0.foo, ref0.bar
	return { foo, bar }
end
