-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/inequality/2_m3.js
local foo, bar = {}, {}
local v = foo ~= bar --[[ ROBLOX CHECK: loose inequality used upstream ]] -- true
