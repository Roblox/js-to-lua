local b = 2
local c = -5
local foo = bit32.arshift(c, b) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]]
