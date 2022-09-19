-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/greater-equal-than/14_m3x.js
local a, b = true, 0
local foo = a >= b --[[ ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number ]] -- true
