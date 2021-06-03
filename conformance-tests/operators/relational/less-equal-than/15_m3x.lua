local a, b = true, 1
local foo = a <= b --[[ ROBLOX CHECK: operator <= works only if either both arguments are strings or both are a number ]]
