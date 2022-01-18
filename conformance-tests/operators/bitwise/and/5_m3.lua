local c = -5 -- 11111111111111111111111111111011
local foo = bit32.band(c, c) --[[ ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1] ]] -- -5
