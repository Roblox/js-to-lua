local object1 = {key = "value"}
local object2 = {key = "value"}
local foo = object1 == object2 --[[ ROBLOX CHECK: loose equality used upstream ]]
local bar = object2 == object2 --[[ ROBLOX CHECK: loose equality used upstream ]]
