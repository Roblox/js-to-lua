local a = 5
local b = 2
a = bit32.arshift(a, b) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]]
