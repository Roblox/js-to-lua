local a = 5
local foo = bit32.bor(a, a) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]]
