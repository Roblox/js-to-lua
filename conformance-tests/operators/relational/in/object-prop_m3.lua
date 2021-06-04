local obj = {foo = 'bar'}
local prop = "foo"

local hasFoo = Array.indexOf(Object.keys(obj), prop) ~= -1
