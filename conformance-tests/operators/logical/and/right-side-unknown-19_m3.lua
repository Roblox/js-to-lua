local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy2 = {}
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(truthy2) then
		return falsy
	else
		return truthy2
	end
end)()
