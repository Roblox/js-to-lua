local a = 5
a = bit32.band(a, a) --[[ ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1] ]]
