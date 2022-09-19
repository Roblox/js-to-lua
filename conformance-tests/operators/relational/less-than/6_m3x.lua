-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/less-than/6_m3x.js
local a, b = "hello", 5
local foo = a < b --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
