local falsy0 = false
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy0) then
		return falsy
	else
		return falsy0
	end
end)()
