local a, b = "a", "a"
local foo = a < b --[[ ROBLOX CHECK: operator < works only if either both arguments are strings or both are a number ]]
