local a, b = 0, false
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
