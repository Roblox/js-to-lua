local a = 5 -- 00000000000000000000000000000101
local b = 2 -- 00000000000000000000000000000010
local foo = bit32.rshift(a, b) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]] -- 1
