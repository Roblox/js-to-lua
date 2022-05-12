local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local retryTimes
local ref = parseInt(foo, 10)
retryTimes = Boolean.toJSBoolean(ref) and ref or 0
