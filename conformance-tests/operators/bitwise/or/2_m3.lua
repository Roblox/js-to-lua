-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/or/2_m3.js
local a = 5 -- 00000000000000000000000000000101
local b = 2 -- 00000000000000000000000000000010
local foo = bit32.bor(b, a) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]] -- 7
