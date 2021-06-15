local truthy1 = 1
local falsy = nil

local foo = (function()
	if Boolean.toJSBoolean(truthy1) then
		return falsy
	else
		return truthy1
	end
end)()
