local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy0 = true
local truthy = {}
local foo = if Boolean.toJSBoolean(truthy0) then truthy else truthy0
