-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/inequality/9_m3.js
local a, b = 0, not not false --[[ ROBLOX DEVIATION: coerced from `undefined` to preserve JS behavior ]]
local foo = a ~= b --[[ ROBLOX CHECK: loose inequality used upstream ]] -- false, look at Logical NOT operator
