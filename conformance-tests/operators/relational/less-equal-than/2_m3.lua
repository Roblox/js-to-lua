-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/less-equal-than/2_m3.js
local a, b = "a", "3"
local foo = a <= b --[[ ROBLOX CHECK: operator '<=' works only if either both arguments are strings or both are a number ]] -- false
