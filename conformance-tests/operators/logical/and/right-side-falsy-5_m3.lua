-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/and/right-side-falsy-5_m3.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a = {}
local foo = if Boolean.toJSBoolean(a) then 0 / 0 else a -- NaN is truthy in Lua
