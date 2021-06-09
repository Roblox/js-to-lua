local obj = {foo = "bar"}
local hasFoo = Array.indexOf(Object.keys(obj), tostring(0)) ~= -1
