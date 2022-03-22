local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local exports = {}
exports.default = not not Boolean.toJSBoolean(process.stdout.isTTY)
	and process.env.TERM ~= "dumb"
	and not Boolean.toJSBoolean(isCI)
return exports
