local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy2 = {}
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(truthy2) then
		return truthy
	else
		return truthy2
	end
end)()
