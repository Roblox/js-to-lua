-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/shift-right/0_m3.js
local a = 5 -- 00000000000000000000000000000101
local foo = bit32.arshift(a, a) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]] -- 0
