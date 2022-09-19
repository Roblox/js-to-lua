-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/10_m3.js
local a, b = nil, nil
local foo = a == b --[[ ROBLOX CHECK: loose equality used upstream ]] -- true
