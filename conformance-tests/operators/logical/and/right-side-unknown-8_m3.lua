local falsy2 = nil
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy2) then
		return falsy
	else
		return falsy2
	end
end)()
