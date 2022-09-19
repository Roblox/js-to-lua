-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/and/right-side-unknown-18_m3.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local truthy1 = 1
local falsy = nil
local foo = if Boolean.toJSBoolean(truthy1) then falsy else truthy1
