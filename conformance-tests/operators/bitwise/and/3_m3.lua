local a = 5
local c = -5
local foo = bit32.band(a, c) --[[ ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1] ]]
