-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/shift-right-unsigned/5_m3.js
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.rshift(c, 0) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]] -- 4294967291
