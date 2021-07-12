local a, b
local c = (function()
	if
		true --[[ ROBLOX DEVIATION: coerced from `'foo'` to preserve JS behavior ]]
	then
		return a
	else
		return b
	end
end)()
