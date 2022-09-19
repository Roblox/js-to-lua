-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/ternary/1_m4.js
local a, b
local c = if true --[[ ROBLOX DEVIATION: coerced from `'foo'` to preserve JS behavior ]]
	then a
	else b
