local obj = {foo = "bar"}
local hasFoo = Array.indexOf(Object.keys(obj), tostring(true)) ~= -1
