-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/shift-right/3_m3.js
local a = 5 -- 00000000000000000000000000000101
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.arshift(c, a) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]] -- -1
