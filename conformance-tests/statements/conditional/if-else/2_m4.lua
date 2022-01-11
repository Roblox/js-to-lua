local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c
if Boolean.toJSBoolean(a) then
	a = false
elseif Boolean.toJSBoolean(b) then
	b = false
else
	c = false
end
