local a = 0
local v = (function()
	a -= 1
	return a
end)()
