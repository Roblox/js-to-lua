local a, b = 0, not not false --[[ ROBLOX DEVIATION: coerced from `undefined` to preserve JS behavior ]]
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true, look at Logical NOT operator
