-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/copyright-tag/copyright-with-polyfills_m5.js
--[[*
 * @file This is my cool script.
 * @copyright XYZ
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
