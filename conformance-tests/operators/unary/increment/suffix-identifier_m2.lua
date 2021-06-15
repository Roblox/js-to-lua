local a = 0
local v = (function()
	local result = a
	a += 1
	return result
end)()
