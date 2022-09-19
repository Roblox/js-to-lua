-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/sequence/1_m4.js
local a, b = 0, 1
local function baz() end
a += 1
b -= 1
local refProp0 = baz()
local foo = { bar = refProp0 }
