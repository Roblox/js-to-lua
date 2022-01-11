local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy5 = 0 / 0
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy5) then
		return falsy
	else
		return falsy5
	end
end)()
