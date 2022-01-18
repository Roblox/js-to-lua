local a, b = "hello", "hello"
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]] -- false
