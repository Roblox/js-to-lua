-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/shift-right-unsigned/0_m3.js
local a = 5 -- 00000000000000000000000000000101
local foo = bit32.rshift(a, a) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]] -- 0
