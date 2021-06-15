local falsy3 = 0
local truthy = {}

local foo = (function()
	if Boolean.toJSBoolean(falsy3) then
		return truthy
	else
		return falsy3
	end
end)()
