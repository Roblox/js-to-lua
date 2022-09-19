-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/greater-than/20_m3x.js
local a, b = 3, nil
local foo = a > b --[[ ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number ]] -- false
