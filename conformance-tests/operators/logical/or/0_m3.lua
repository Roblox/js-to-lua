local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy0 = false
local truthy = {}
local foo = Boolean.toJSBoolean(falsy0) and falsy0 or truthy
