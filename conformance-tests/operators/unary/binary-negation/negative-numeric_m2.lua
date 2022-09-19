-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/binary-negation/negative-numeric_m2.js
local b = bit32.bnot(-3) --[[ ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1] ]]
