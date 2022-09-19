-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/less-than/21_m3.js
local a, b = 3, 0 / 0
local foo = a < b --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
