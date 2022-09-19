-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/and/right-side-unknown-3_m3.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy3 = 0
local truthy = {}
local foo = if Boolean.toJSBoolean(falsy3) then truthy else falsy3
