local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy3 = {}
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(truthy3) then
		return falsy
	else
		return truthy3
	end
end)()
