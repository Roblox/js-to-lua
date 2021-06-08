local foo, bar = {}, {}
local v = foo ~= bar --[[ ROBLOX CHECK: loose inequality used upstream ]]
