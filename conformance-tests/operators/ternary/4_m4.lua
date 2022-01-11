local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c, d, e
local f = (function()
	if Boolean.toJSBoolean(a) then
		return (function()
			if Boolean.toJSBoolean(b) then
				return c
			else
				return d
			end
		end)()
	else
		return e
	end
end)()
