-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-remainder/6_m4.js
local a, b, c = 1, 2, 3
b %= c
a %= b
local refProp0 = a
b %= 1
a %= b
local refProp1 = a
local foo = { bar = refProp0, baz = refProp1 }
