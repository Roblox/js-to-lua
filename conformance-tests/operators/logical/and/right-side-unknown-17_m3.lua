local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy0 = true
local falsy = nil
local foo = if Boolean.toJSBoolean(truthy0) then falsy else truthy0
