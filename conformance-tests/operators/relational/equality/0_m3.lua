-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/0_m3.js
local a, b = "hello", "hello"
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
