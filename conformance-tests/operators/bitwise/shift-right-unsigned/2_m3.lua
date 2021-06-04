local a = 5
local b = 2

bit32.rshift(b, a) --[[ ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1] ]]
