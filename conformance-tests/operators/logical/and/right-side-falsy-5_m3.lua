local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a = {}
local foo = if Boolean.toJSBoolean(a) then 0 / 0 else a -- NaN is truthy in Lua
