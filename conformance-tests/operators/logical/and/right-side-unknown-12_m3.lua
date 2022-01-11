local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy0 = true
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(truthy0) then
		return truthy
	else
		return truthy0
	end
end)()
