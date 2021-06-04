local a = 5
local b = 2

bit32.bxor(a, b) --[[ ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1] ]]
