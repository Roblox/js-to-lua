local a = 5
a = bit32.bor(a, a) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]]
