local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy3 = {}
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(truthy3) then
		return truthy
	else
		return truthy3
	end
end)()
