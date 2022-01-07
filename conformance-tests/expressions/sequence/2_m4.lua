local a, b = 0, 1
local c = (function()
	a += 1
	return (function()
		b -= 1
		return b
	end)()
end)()
