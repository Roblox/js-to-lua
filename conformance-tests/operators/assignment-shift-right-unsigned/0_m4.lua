local a = 5

a = bit32.rshift(a, a) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]
