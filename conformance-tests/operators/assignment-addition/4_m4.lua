-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-addition/4_m4.js
local a = 1
local function foo(bar) end
a ..= "bar"
foo(a)
