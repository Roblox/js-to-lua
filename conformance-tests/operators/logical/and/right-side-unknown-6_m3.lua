local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy0 = false
local falsy = nil
local foo = if Boolean.toJSBoolean(falsy0) then falsy else falsy0
