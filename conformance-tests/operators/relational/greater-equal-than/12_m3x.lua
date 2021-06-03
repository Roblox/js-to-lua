local a, b = true, true
local foo = a >= b --[[ ROBLOX CHECK: operator >= works only if either both arguments are strings or both are a number ]]
