local a, b, c, d = 1, "this is ", 2, 3
c += d
a += c
local refProp0 = a
b ..= "roblox"
a ..= b
local refProp1 = a
local foo = { bar = refProp0, baz = refProp1 }
