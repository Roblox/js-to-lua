local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy4 = ""
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy4) then
		return falsy
	else
		return falsy4
	end
end)()
