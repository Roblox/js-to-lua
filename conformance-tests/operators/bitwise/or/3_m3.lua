local a = 5
local b = 2
local c = -5

bit32.bor(a, c) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]]