local b = 2
local c = -3

bit32.lshift(c, b) --[[ ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1] ]]
