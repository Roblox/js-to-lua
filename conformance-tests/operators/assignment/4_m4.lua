-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/4_m4.js
local a, b, c
local function foo(bar) end
c = "bar"
b = c
a = b
foo(a)
