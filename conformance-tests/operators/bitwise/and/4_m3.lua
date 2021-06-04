local a = 5
local b = 2
local c = -5

bit32.band(b, c) --[[ ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1] ]]
