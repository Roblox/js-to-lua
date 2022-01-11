local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a = {}
local foo = (function()
	if Boolean.toJSBoolean(a) then
		return nil
	else
		return a
	end
end)()
