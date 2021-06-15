local truthy1 = 1
local truthy = {}

local foo = (function()
	if Boolean.toJSBoolean(truthy1) then
		return truthy
	else
		return truthy1
	end
end)()
