local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy1 = nil
local falsy = nil
local foo = Boolean.toJSBoolean(falsy1) and falsy1 or falsy
