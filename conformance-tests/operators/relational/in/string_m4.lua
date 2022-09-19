-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/in/string_m4.js
local str = tostring("foo bar")

local hasIndex = Array.indexOf(Object.keys(obj), 1) ~= -1
