local c = -5

c = bit32.rshift(c, 0) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]