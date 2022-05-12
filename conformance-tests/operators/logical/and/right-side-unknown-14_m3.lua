local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy2 = {}
local truthy = {}
local foo = if Boolean.toJSBoolean(truthy2) then truthy else truthy2
