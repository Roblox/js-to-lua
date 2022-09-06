--[[*
 * Utility functions for the foo package.
 * @module foo/util
 * @license MIT
 ]]
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local console = LuauPolyfill.console
local function foo(bar)
	if Boolean.toJSBoolean(bar) then
		console.log(bar)
	end
end
