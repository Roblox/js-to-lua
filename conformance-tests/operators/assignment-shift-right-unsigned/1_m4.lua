-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-shift-right-unsigned/1_m4.js
local a = 5
local b = 2
a = bit32.rshift(a, b) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]
