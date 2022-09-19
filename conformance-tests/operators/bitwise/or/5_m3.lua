-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/bitwise/or/5_m3.js
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.bor(c, c) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]] -- -5
