-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-addition/5_m4.js
local a, b, c = 1, "this is ", 2
local function foo(bar) end
c ..= "bar"
b ..= c
a ..= b
foo(a)
