local falsy3 = 0
local falsy = nil

local foo = (function()
	if Boolean.toJSBoolean(falsy3) then
		return falsy
	else
		return falsy3
	end
end)()
