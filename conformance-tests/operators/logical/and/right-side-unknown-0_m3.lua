local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy0 = false
local truthy = {}
local foo = if Boolean.toJSBoolean(falsy0) then truthy else falsy0
