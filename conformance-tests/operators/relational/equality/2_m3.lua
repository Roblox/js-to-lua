local foo, bar = {}, {}
local v = foo == bar --[[ ROBLOX CHECK: loose equality used upstream ]] -- false
