-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/binary-negation/positive-numeric_m2.js
local a = bit32.bnot(5) --[[ ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1] ]]
