-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/greater-than/14_m3x.js
local a, b = false, true
local foo = a > b --[[ ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number ]] -- false
