local a = 5
local c = -3

bit32.lshift(c, a) --[[ ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1] ]]
