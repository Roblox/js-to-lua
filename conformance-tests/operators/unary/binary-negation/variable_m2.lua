local a = 1
local c = bit32.bnot(a) --[[ ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1] ]]
