-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/if-else/multiple_statements_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, c, d
if Boolean.toJSBoolean(a) then
	c = true
	d = false
elseif Boolean.toJSBoolean(b) then
	c = false
	d = true
else
	c = false
	d = false
end
