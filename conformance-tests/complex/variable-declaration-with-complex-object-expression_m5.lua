local a, b = 0, 0
local refProp0 = a
a += 1
b += 1
local refProp1 = b
local refProp2 = a
a += 1
local refProp3 = b
b += 1
a += 1
local refProp4 = b
b += 1
local foo0 = { bar = refProp0, baz = refProp1, fizz = refProp2, buzz = refProp3, jazz = refProp4 }
