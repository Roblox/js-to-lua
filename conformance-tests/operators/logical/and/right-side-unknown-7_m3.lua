local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy1 = nil
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy1) then
		return falsy
	else
		return falsy1
	end
end)()
