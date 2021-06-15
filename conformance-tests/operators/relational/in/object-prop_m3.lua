local obj = { foo = "bar" }
local prop = "foo"
local hasFoo = Array.indexOf(Object.keys(obj), tostring(prop)) ~= -1
