local a = 5
local b = 2
local foo = bit32.arshift(b, a) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]]
