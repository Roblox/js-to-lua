local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy1 = nil
local truthy = {}
local foo = if Boolean.toJSBoolean(falsy1) then truthy else falsy1
