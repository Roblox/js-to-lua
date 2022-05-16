local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a = {}
local foo = if Boolean.toJSBoolean(a) then "" else a -- '' is truthy in Lua
