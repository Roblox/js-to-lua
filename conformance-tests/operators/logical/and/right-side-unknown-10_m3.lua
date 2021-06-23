local falsy4 = ""
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy4) then
		return falsy
	else
		return falsy4
	end
end)()
