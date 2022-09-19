-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-division/5_m4.js
local a, b, c = 1, 2, 3
local function foo(bar) end
c /= 1
b /= c
a /= b
foo(a)
