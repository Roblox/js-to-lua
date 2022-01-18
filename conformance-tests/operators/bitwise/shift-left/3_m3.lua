local a = 5 -- 00000000000000000000000000000101
local c = -3 -- 11111111111111111111111111111101
local foo = bit32.lshift(c, a) --[[ ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1] ]] -- -96
