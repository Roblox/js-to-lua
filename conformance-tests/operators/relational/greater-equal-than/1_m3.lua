-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/greater-equal-than/1_m3.js
local a, b = "a", "a"
local foo = a >= b --[[ ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number ]] -- true
