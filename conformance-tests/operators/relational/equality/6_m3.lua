local a, b = 0, nil
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- false
