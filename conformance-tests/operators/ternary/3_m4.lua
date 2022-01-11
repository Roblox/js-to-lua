local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c, d = 1, 2
local e = (function()
	if Boolean.toJSBoolean(a + b) then
		return c
	else
		return d
	end
end)()
