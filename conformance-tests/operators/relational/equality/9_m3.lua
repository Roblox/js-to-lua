-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/9_m3.js
local a, b = 0, not not false --[[ ROBLOX DEVIATION: coerced from `undefined` to preserve JS behavior ]]
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true, look at Logical NOT operator
