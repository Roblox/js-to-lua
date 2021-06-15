local a, b, c
local d = (function()
	if Boolean.toJSBoolean(a) then
		return b
	else
		return c
	end
end)()
