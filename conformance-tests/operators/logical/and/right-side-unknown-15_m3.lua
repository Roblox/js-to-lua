local truthy3 = {}
local truthy = {}

local foo = (function()
	if Boolean.toJSBoolean(truthy3) then
		return truthy
	else
		return truthy3
	end
end)()
