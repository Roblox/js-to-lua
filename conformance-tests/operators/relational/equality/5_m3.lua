-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/5_m3.js
local a, b = 0, false
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
