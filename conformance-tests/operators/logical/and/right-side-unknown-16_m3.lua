local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy4 = "truthy"
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(truthy4) then
		return truthy
	else
		return truthy4
	end
end)()
