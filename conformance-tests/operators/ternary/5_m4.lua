local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b
local c = (function()
	if Boolean.toJSBoolean(a) then
		return false
	else
		return b
	end
end)()
