local a = 5
local b = 2

bit32.arshift(b, a) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]]
