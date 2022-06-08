local a, b, c = 1, 2, 3
b %= c
a %= b
local refProp0 = a
b %= 1
a %= b
local refProp1 = a
local foo = { bar = refProp0, baz = refProp1 }
