-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/license-tag/copyright-with-polyfills_m5.js
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
