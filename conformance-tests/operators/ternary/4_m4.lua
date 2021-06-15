local a, b, c, d
local f = (function()
	if Boolean.toJSBoolean(a) then
		return (function()
			if Boolean.toJSBoolean(b) then
				return c
			else
				return d
			end
		end)()
	else
		return e
	end
end)()
