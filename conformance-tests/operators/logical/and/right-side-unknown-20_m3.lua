local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy3 = {}
local falsy = nil
local foo = if Boolean.toJSBoolean(truthy3) then falsy else truthy3
