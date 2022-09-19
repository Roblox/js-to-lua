-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/8_m3.js
local a, b = 0, not not false --[[ ROBLOX DEVIATION: coerced from `null` to preserve JS behavior ]]
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true, look at Logical NOT operator
