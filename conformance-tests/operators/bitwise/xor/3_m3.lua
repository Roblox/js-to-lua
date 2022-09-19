-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/xor/3_m3.js
local a = 5 -- 00000000000000000000000000000101
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.bxor(a, c) --[[ ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1] ]] -- -2
