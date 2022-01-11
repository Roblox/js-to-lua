local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy4 = ""
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(falsy4) then
		return truthy
	else
		return falsy4
	end
end)()
