local c = -5 -- 11111111111111111111111111111011
local foo = bit32.bor(c, c) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]] -- -5
