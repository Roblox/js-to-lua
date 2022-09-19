-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-addition/1_m4.js
local a, b, c = 1, "this is ", 2
c ..= "foo"
b ..= c
a ..= b
