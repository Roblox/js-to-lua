local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy0 = false
local falsy = nil
local foo = (function()
	if Boolean.toJSBoolean(falsy0) then
		return falsy
	else
		return falsy0
	end
end)()
