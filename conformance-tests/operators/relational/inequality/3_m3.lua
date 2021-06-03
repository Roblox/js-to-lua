local a, b = 1, 1
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]]
