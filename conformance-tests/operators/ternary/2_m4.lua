local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c
local d = (function()
	if Boolean.toJSBoolean(a) then
		return b
	else
		return c
	end
end)()
