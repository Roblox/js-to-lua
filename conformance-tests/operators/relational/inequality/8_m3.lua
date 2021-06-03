local a, b = 0, not not false --[[ ROBLOX DEVIATION: coerced from `null` to preserve JS behavior ]]
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]]
