local a = 5
local b = 2
local foo = bit32.rshift(a, b) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]
