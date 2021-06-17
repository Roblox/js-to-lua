local a = 5
local b = 2
local foo = bit32.lshift(a, b) --[[ ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1] ]]
