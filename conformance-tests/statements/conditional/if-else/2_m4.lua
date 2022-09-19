-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/if-else/2_m4.js
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
