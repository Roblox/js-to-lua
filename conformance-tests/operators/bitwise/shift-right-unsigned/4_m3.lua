-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/shift-right-unsigned/4_m3.js
local b = 2 -- 00000000000000000000000000000010
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.rshift(c, b) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]] -- 1073741822
