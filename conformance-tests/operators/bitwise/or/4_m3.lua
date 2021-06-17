local b = 2
local c = -5
local foo = bit32.bor(b, c) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]]
