local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy3 = {}
local truthy = {}
local foo = if Boolean.toJSBoolean(truthy3) then truthy else truthy3
