local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy2 = {}
local falsy = nil
local foo = if Boolean.toJSBoolean(truthy2) then falsy else truthy2
