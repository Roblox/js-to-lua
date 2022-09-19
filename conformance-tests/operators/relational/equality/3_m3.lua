-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/3_m3.js
local a, b = 1, 1
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
