local truthy3 = {}
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(truthy3) then
		return falsy
	else
		return truthy3
	end
end)()
