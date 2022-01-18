local b = 2 -- 00000000000000000000000000000010
local c = -5 -- 11111111111111111111111111111011
local foo = bit32.bxor(b, c) --[[ ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1] ]] -- -7
