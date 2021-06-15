local falsy5 = 0 / 0
local truthy = {}

local foo = (function()
	if Boolean.toJSBoolean(falsy5) then
		return truthy
	else
		return falsy5
	end
end)()
