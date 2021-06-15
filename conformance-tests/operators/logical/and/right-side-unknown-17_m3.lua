local truthy0 = true
local falsy = nil

local foo = (function()
	if Boolean.toJSBoolean(truthy0) then
		return falsy
	else
		return truthy0
	end
end)()
