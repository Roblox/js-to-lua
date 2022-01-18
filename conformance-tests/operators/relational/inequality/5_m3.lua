local a, b = 0, false
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]] -- false
