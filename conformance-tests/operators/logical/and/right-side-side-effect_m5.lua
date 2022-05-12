local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local foo
local bar = Boolean.toJSBoolean(foo) and foo or (function()
	foo = 0
	return foo
end)()
