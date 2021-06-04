local b = 2
local c = -5

bit32.rshift(c, b) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]
