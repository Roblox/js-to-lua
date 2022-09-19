-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/object_m3.js
local object1 = { key = "value" }
local object2 = { key = "value" }
local foo = object1 == object2 --[[ ROBLOX CHECK: loose equality used upstream ]] -- false
local bar = object2 == object2 --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
