local a = {}

local foo = (function()
	if Boolean.toJSBoolean(a) then
		return false
	else
		return a
	end
end)()
