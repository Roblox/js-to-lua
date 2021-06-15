local a, b
local c = (function()
	if true then
		return a
	else
		return b
	end
end)()
