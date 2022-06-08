local a, b = 0, 1
local function baz() end
a += 1
b -= 1
local refProp0 = baz()
local foo = { bar = refProp0 }
