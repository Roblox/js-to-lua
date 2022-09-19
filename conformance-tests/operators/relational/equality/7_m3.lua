-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/7_m3.js
local a, b = 0, nil
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- false
