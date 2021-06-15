local a, b, c, d = 1, 2
local e = (function()
	if Boolean.toJSBoolean(a + b) then
		return c
	else
		return d
	end
end)()
