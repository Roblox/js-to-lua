local a = 5
a = bit32.bxor(a, a) --[[ ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1] ]]
