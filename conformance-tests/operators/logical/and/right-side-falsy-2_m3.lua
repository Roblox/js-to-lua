local a = {}
local foo = (function()
	if Boolean.toJSBoolean(a) then
		return nil
	else
		return a
	end
end)()
