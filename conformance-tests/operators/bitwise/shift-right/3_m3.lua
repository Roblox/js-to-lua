local a = 5
local c = -5

bit32.arshift(c, a) --[[ ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1] ]]
