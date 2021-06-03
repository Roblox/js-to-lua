local a, b = nil, nil
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]]
