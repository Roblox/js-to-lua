local falsy1 = nil
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(falsy1) then
		return truthy
	else
		return falsy1
	end
end)()
