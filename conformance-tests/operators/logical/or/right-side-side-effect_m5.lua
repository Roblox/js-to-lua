local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local foo
local bar = if Boolean.toJSBoolean(foo)
	then (function()
		foo = 0
		return foo
	end)()
	else foo
